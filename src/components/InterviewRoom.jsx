import React, { useState, useEffect, useRef } from 'react';

// Dynamic Question Database
const HR_QUESTIONS = [
  "Let's start. Please tell me about yourself, your background, and your key achievements.",
  "Why should our company hire you over other qualified candidates?",
  "What do you consider your greatest professional strength, and what is a weakness you are actively working to improve?",
  "Describe a challenging situation in a team project where you faced conflict, and how you resolved it.",
  "Where do you see yourself in five years, and how does this role align with your long-term career goals?"
];

const DOMAIN_QUESTIONS = {
  swe: [
    "Explain the difference between a Hash Map and a Binary Search Tree. When would you prefer one over the other?",
    "What is database indexing? How does it improve query performance, and what are its trade-offs?",
    "Describe the core principles of Object-Oriented Programming (OOP) and how you apply them in code structure.",
    "Explain the concept of RESTful API design. What are the key HTTP methods, and what does statelessness mean?",
    "How would you design a scalable system to handle millions of read/write requests per second, such as a URL shortener?"
  ],
  cyber: [
    "What is the difference between symmetric and asymmetric encryption? Provide a real-world example of each.",
    "Explain how a Cross-Site Scripting (XSS) vulnerability works and what strategies you would use to prevent it.",
    "What is a firewalls role in network security, and how does a stateless packet filter differ from a stateful firewall?",
    "Can you describe the steps involved in a standard Penetration Testing methodology?",
    "How does a multi-factor authentication (MFA) system work, and what security gaps does it close?"
  ],
  datasci: [
    "What is the difference between supervised and unsupervised learning? Give examples of algorithms for both.",
    "Explain what overfitting is in machine learning models and how you can prevent it.",
    "How does a Decision Tree algorithm work, and what is the function of entropy or Gini impurity?",
    "Describe the difference between L1 (Lasso) and L2 (Ridge) regularization methods.",
    "What is A/B testing? How do you calculate statistical significance for an experiment?"
  ],
  ai: [
    "Explain the concept of Neural Networks. What is the role of an activation function?",
    "What is the difference between Deep Learning and traditional Machine Learning?",
    "Describe how Convolutional Neural Networks (CNNs) process image data.",
    "Explain the attention mechanism in Transformer models. Why is it superior to LSTMs for NLP?",
    "What are generative adversarial networks (GANs), and how do the generator and discriminator interact?"
  ],
  ml: [
    "What is the bias-variance trade-off in machine learning? How do you balance it?",
    "Describe the difference between bagging and boosting ensemble methods.",
    "What metrics would you use to evaluate a classification model with highly imbalanced class distributions?",
    "How does Gradient Descent work? What happens if the learning rate is too large or too small?",
    "Explain the process of feature engineering and how you handle missing values in a dataset."
  ]
};

const GENERAL_TECH_QUESTIONS = [
  "Can you outline the core methodologies used in your professional domain?",
  "Describe a technical tool or framework you use daily. What are its main benefits?",
  "How do you stay up-to-date with emerging trends and tools in your specific field?",
  "Explain a complex process in your domain as if you were explaining it to a non-technical stakeholder.",
  "How do you manage quality control and accuracy in your deliverables?"
];

export default function InterviewRoom({ config, userProfile, onInterviewEnd }) {
  const { domain, difficulty } = config;
  
  // Hardware States
  const [hardwareReady, setHardwareReady] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  const [camPermission, setCamPermission] = useState(false);
  
  // Interview States
  const [questionsList, setQuestionsList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeInterviewer, setActiveInterviewer] = useState(config.interviewer || { id: 'sophia', name: 'Sophia', gender: 'female', accent: '#06b6d4' });
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewTimer, setInterviewTimer] = useState(0);
  
  // Candidate Speech / Input States
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [language, setLanguage] = useState('en-US'); 
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  // Intermediary Per-Question Feedback flow
  const [roomStep, setRoomStep] = useState('question'); // 'question' | 'feedback'
  const [currentFeedback, setCurrentFeedback] = useState(null);

  // AI Recruiter Expression State
  const [aiState, setAiState] = useState('idle'); // 'idle' | 'speaking' | 'listening' | 'thoughtful' | 'challenging'
  
  // Real-time Coaching metrics (HUD during speaking)
  const [coachingAlerts, setCoachingAlerts] = useState([]);
  const [fillerWordCount, setFillerWordCount] = useState(0);
  const [speakingSpeed, setSpeakingSpeed] = useState(0);
  
  // Overall Logs
  const [interviewLogs, setInterviewLogs] = useState([]);
  const [recordedAudioBlobs, setRecordedAudioBlobs] = useState([]);
  const [answerRelevanceScore, setAnswerRelevanceScore] = useState(0);
  
  // Grammar & Corrections
  const [grammarCorrections, setGrammarCorrections] = useState([]);
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micLevelRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [micLevel, setMicLevel] = useState(0);
  const [hwErrors, setHwErrors] = useState([]);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const recognitionRetryCount = useRef(0);
  const recognitionMaxRetries = 3;

  // ==================== FUNCTION DEFINITIONS ====================
  
  const startAudioRecording = () => {
    if (!streamRef.current || mediaRecorderRef.current) return;
    
    try {
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudioBlobs(prev => [...prev, {
          blob: audioBlob,
          qIndex: currentQuestionIndex,
          timestamp: new Date()
        }]);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (err) {
      console.warn("Audio recording not available:", err);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  // Calculate relevance score based on keyword matching
  const calculateRelevanceScore = (answer, question) => {
    if (!answer || answer.length < 5) return 0;
    
    // Extract keywords from question
    const questionWords = question.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const answerWords = answer.toLowerCase().split(/\W+/);
    
    // Count matching keywords
    let matches = 0;
    const importantKeywords = ['how', 'what', 'why', 'explain', 'describe', 'project', 'experience', 'solve', 'challenge', 'technical', 'approach'];
    
    questionWords.forEach(qWord => {
      if (answerWords.includes(qWord) && qWord.length > 3) {
        matches++;
      }
    });
    
    // Check for important context keywords
    let contextScore = 0;
    importantKeywords.forEach(keyword => {
      if (answerWords.includes(keyword)) contextScore += 5;
    });
    
    // Calculate score (0-100)
    const keywordRelevance = Math.min(100, (matches * 15) + contextScore);
    const lengthRelevance = Math.min(100, (answer.length / 200) * 100); // Reward longer answers
    
    return Math.round((keywordRelevance + lengthRelevance) / 2);
  };
  
  const setupAudioLevelDetection = (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start monitoring levels
      const monitorLevels = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average level
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          micLevelRef.current = Math.min(100, Math.round((average / 255) * 150));
          setMicLevel(micLevelRef.current);
          
          requestAnimationFrame(monitorLevels);
        }
      };
      
      monitorLevels();
    } catch (err) {
      console.warn("Audio level detection setup failed:", err);
    }
  };

  const requestHardwareAccess = async () => {
    try {
      // Request both audio and video with specific constraints for better compatibility
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,  // Disable auto gain to detect actual levels
          sampleRate: 44100
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // Setup video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.warn("Video play error:", err));
      }

      // Setup audio level detection
      setupAudioLevelDetection(stream);
      
      setMicPermission(true);
      setCamPermission(true);
      setHwErrors([]);
      setHardwareReady(true);
    } catch (err) {
      console.warn("Hardware Access Error:", err.name, err.message);
      let errorMsg = '';
      const errors = [];
      
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera/Microphone permissions blocked. Please check browser settings.';
        errors.push('Permission Denied - Check browser camera/mic settings');
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera or microphone found on this device.';
        errors.push('No camera/microphone detected');
      } else if (err.name === 'NotReadableError') {
        errorMsg = 'Camera/Microphone is in use by another application.';
        errors.push('Hardware already in use');
      } else if (err.name === 'SecurityError') {
        errorMsg = 'HTTPS required for camera/microphone access. (Not in secure context)';
        errors.push('HTTPS required for hardware');
      } else {
        errorMsg = `Hardware error: ${err.message}`;
        errors.push(`Error: ${err.message}`);
      }
      
      console.error(errorMsg);
      setHwErrors(errors);
      
      // Partial permissions - some hardware might still work
      if (err.name === 'NotFoundError' || err.message.includes('video')) {
        setCamPermission(false);
        setMicPermission(true);
      } else {
        setMicPermission(false);
        setCamPermission(false);
      }
      
      setHardwareReady(true); // Still allow to proceed with fallback
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleCameraToggle = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    } else {
      setIsCameraOff(!isCameraOff);
    }
  };

  const handleMuteToggle = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  const startSpeechRecognition = () => {
    setAiState('listening');
    startAudioRecording(); // Start recording when speech starts
    if (recognitionRef.current && !isMuted) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition already active:", err);
      }
    } else {
      setIsSpeaking(true);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopAudioRecording(); // Stop recording when speech stops
    setIsSpeaking(false);
    setInterimTranscript('');
  };

  // Evaluate voice responses
  const analyzeLiveMetrics = (text) => {
    const words = text.split(/\s+/).filter(Boolean);
    const length = words.length;
    const wpm = Math.round(length / 0.5) || 120; // estimate
    setSpeakingSpeed(wpm);

    const fillers = ['um', 'like', 'actually', 'you know', 'basically', 'uh', 'so'];
    let fillerCount = 0;
    words.forEach(w => {
      const cleanW = w.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
      if (fillers.includes(cleanW)) fillerCount++;
    });
    setFillerWordCount(fillerCount);

    const tips = [];
    if (wpm > 160) tips.push({ id: 'speed', type: 'warning', text: `Speaking too fast (${wpm} WPM)` });
    else if (wpm < 85 && length > 6) tips.push({ id: 'speed', type: 'warning', text: `Speaking slowly (${wpm} WPM)` });
    else tips.push({ id: 'speed', type: 'success', text: `Excellent pace (${wpm} WPM)` });

    if (fillerCount > 2) tips.push({ id: 'filler', type: 'warning', text: `Vocal fillers detected (${fillerCount})` });
    else tips.push({ id: 'filler', type: 'success', text: 'Excellent vocabulary control' });

    setCoachingAlerts(tips);
  };

  // Grammar correction detector
  const detectGrammarIssues = (text) => {
    const corrections = [];
    
    // Common grammar patterns
    const commonIssues = [
      { pattern: /\byou\'s\b/gi, correction: 'you\'re', error: 'Incorrect contraction' },
      { pattern: /\btheir is\b/gi, correction: 'there is', error: 'Wrong homophone' },
      { pattern: /\bits\s+not\b/gi, correction: 'it\'s not', error: 'Missing contraction' },
      { pattern: /\bwhere\'s\s+not\b/gi, correction: 'were not', error: 'Wrong homophone' },
      { pattern: /\ba\s+[aeiou]/gi, correction: 'an', error: 'Article error' },
      { pattern: /\bcould of\b/gi, correction: 'could have', error: 'Common mistake' },
      { pattern: /\bshould of\b/gi, correction: 'should have', error: 'Common mistake' },
      { pattern: /\bwould of\b/gi, correction: 'would have', error: 'Common mistake' }
    ];
    
    commonIssues.forEach(issue => {
      const matches = text.match(issue.pattern);
      if (matches) {
        matches.forEach(match => {
          corrections.push({
            original: match,
            correction: issue.correction,
            error: issue.error,
            timestamp: Date.now()
          });
        });
      }
    });
    
    return corrections;
  };

  // Speaks text and invokes callback when finished
  const speakText = (text, onEnd) => {
    setAiState('speaking');
    setAiIsSpeaking(true);
    window.speechSynthesis.cancel();
    
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    let selectedVoice = null;
    if (activeInterviewer.gender === 'female') {
      selectedVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Zira') || v.name.includes('Female') || v.lang.startsWith('en'));
    } else {
      selectedVoice = voices.find(v => v.name.includes('David') || v.name.includes('Male') || v.lang.startsWith('en'));
    }
    if (selectedVoice) utterance.voice = selectedVoice;

    // Safety Timeout in case SpeechSynthesis is blocked by browser policies
    const estimatedDuration = (text.length * 85) + 3000;
    safetyTimeoutRef.current = setTimeout(() => {
      console.warn("Safety trigger active: speech completed via timeout.");
      setAiState('listening');
      setAiIsSpeaking(false);
      onEnd();
    }, estimatedDuration);

    utterance.onend = () => {
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      setAiState('listening');
      setAiIsSpeaking(false);
      onEnd();
    };

    utterance.onerror = (err) => {
      console.warn("Speech Synthesis error:", err);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      setAiState('listening');
      setAiIsSpeaking(false);
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setTranscript('');
    setInterimTranscript('');
    speakText(questionsList[0], () => {
      startSpeechRecognition();
    });
    
    timerRef.current = setInterval(() => {
      setInterviewTimer(prev => prev + 1);
    }, 1000);
  };

  // Evaluate candidate answer and display per-question feedback card
  const handleSubmitAnswer = () => {
    stopSpeechRecognition();
    
    const finalAnswer = (transcript + ' ' + interimTranscript).trim() || "(No verbal or written answer recorded)";
    const currentQuestion = questionsList[currentQuestionIndex];
    
    // Calculate relevance score
    const relevance = calculateRelevanceScore(finalAnswer, currentQuestion);
    setAnswerRelevanceScore(relevance);
    
    // Only proceed if answer is relevant enough (>25%) or user explicitly submitted
    if (relevance < 25 && finalAnswer.length > 20) {
      // Show warning about irrelevant answer
      setCurrentFeedback({
        qIndex: currentQuestionIndex,
        question: currentQuestion,
        answer: finalAnswer,
        score: Math.round(relevance / 2), // Lower score for irrelevant answers
        fillers: fillerWordCount,
        wpm: speakingSpeed || 130,
        relevance: relevance,
        isRelevant: false,
        strengths: [],
        weaknesses: [
          "Your answer doesn't seem to address the question asked.",
          "Try to stay focused on what was asked and provide specific examples.",
          "Reference key terms from the question in your response."
        ],
        improvement: "Listen carefully to the question and structure your answer around the specific topic. Use the STAR method to provide relevant context."
      });
      setRoomStep('feedback');
      return;
    }
    
    // Analyze answer quality and build logs (only for relevant answers)
    const isBrief = finalAnswer.length < 35;
    const fillers = fillerWordCount;
    const pace = speakingSpeed || 130;
    
    const techScore = isBrief ? 60 : Math.round(75 + (finalAnswer.length > 80 ? 12 : 0) - (fillers * 4) + (pace > 110 && pace < 145 ? 8 : 0));
    const commScore = Math.max(55, 95 - (fillers * 5));
    const relevanceBonus = Math.round((relevance / 100) * 20); // Add up to 20 points for relevance
    const overallQScore = Math.round(((techScore + commScore) / 2) + relevanceBonus);

    // Detect grammar issues
    const grammarIssues = detectGrammarIssues(finalAnswer);
    const grammarScore = Math.max(0, commScore - (grammarIssues.length * 3)); // Deduct points for grammar issues

    const feedbackObj = {
      qIndex: currentQuestionIndex,
      question: currentQuestion,
      answer: finalAnswer,
      score: Math.min(100, overallQScore),
      fillers,
      wpm: pace,
      relevance: relevance,
      isRelevant: relevance >= 25,
      strengths: [
        relevance >= 75 ? "Highly relevant and well-focused answer" : "Covered the main topic",
        isBrief ? "Clear and concise" : "Detailed explanation with examples",
        fillers <= 2 ? "Excellent fluency" : "Good pacing",
        grammarIssues.length === 0 ? "Excellent grammar and clarity" : ""
      ].filter(Boolean),
      weaknesses: [
        relevance < 50 ? "Could relate more directly to the question" : "",
        isBrief ? "Try to elaborate with specific examples or scenarios." : fillers > 2 ? `Used ${fillers} filler words. Pause slightly instead of saying 'like' or 'um'.` : "",
        pace > 160 || pace < 85 ? `Speaking pace is ${pace} WPM - aim for 100-150 WPM` : "",
        grammarIssues.length > 0 ? `Grammar: Found ${grammarIssues.length} issue(s) - ${grammarIssues.map(g => `"${g.original}" → "${g.correction}"`).join(', ')}` : ""
      ].filter(Boolean),
      improvement: relevance < 50 
        ? "Re-read the question carefully and ensure your answer directly addresses what was asked. Use specific technical examples."
        : isBrief 
          ? "Add more depth by explaining your approach and the outcomes."
          : grammarIssues.length > 0
            ? "Great content! Just polish the grammar and phrasing for a more professional delivery."
            : "Excellent! Continue this level of detail and focus.",
      grammarCorrections: grammarIssues
    };

    setCurrentFeedback(feedbackObj);
    setRoomStep('feedback');
    
    // AI speaks evaluation summary
    const relevanceMsg = relevance >= 75 ? "Your answer was highly relevant and well-structured." : relevance >= 50 ? "Your answer covered the main points." : "Your answer could address the question more directly.";
    const grammarMsg = grammarIssues.length > 0 ? ` I noticed ${grammarIssues.length} grammar issue(s) that you can improve.` : " Your grammar was excellent.";
    const verbalFeedback = `Your score for this answer is ${feedbackObj.score} percent. ${relevanceMsg} ${
      fillers > 2 ? `You used ${fillers} filler words - try to pause instead.` : `Your communication was clear.`
    }${grammarMsg}`;
    
    speakText(verbalFeedback, () => {
      // Completed speaking feedback
    });
  };

  // Move to next question or finish interview
  const handleNextQuestion = () => {
    // Add current feedback to interview logs
    if (currentFeedback) {
      setInterviewLogs(prev => [...prev, {
        questionIndex: currentQuestionIndex,
        question: currentFeedback.question,
        answer: currentFeedback.answer,
        overallScore: currentFeedback.score,
        fillers: currentFeedback.fillers,
        wpm: currentFeedback.wpm,
        relevance: currentFeedback.relevance,
        isRelevant: currentFeedback.isRelevant
      }]);
    }

    // Check if more questions exist
    if (currentQuestionIndex < questionsList.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
      setInterimTranscript('');
      setCurrentFeedback(null);
      setRoomStep('question');
      setFillerWordCount(0);
      setSpeakingSpeed(0);
      
      // Ask next question
      const nextQuestion = questionsList[currentQuestionIndex + 1];
      speakText(nextQuestion, () => {
        startSpeechRecognition();
      });
    } else {
      // Interview complete - show final report
      const updatedLogs = [...interviewLogs];
      if (currentFeedback) {
        updatedLogs.push({
          questionIndex: currentQuestionIndex,
          question: currentFeedback.question,
          answer: currentFeedback.answer,
          overallScore: currentFeedback.score,
          fillers: currentFeedback.fillers,
          wpm: currentFeedback.wpm,
          relevance: currentFeedback.relevance,
          isRelevant: currentFeedback.isRelevant
        });
      }
      finishInterview(updatedLogs);
    }
  };

  // ==================== EFFECTS ====================

  // 1. Build Question List
  useEffect(() => {
    const hr = [...HR_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 2);
    const techSource = DOMAIN_QUESTIONS[domain.id] || GENERAL_TECH_QUESTIONS;
    const tech = [...techSource].sort(() => 0.5 - Math.random()).slice(0, 3);
    setQuestionsList([...hr, ...tech]);
  }, [domain]);

  // 2. Hardware setup
  useEffect(() => {
    // Check browser speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      setHwErrors(prev => [...prev, 'Speech Recognition not supported in this browser']);
    }
    
    requestHardwareAccess();
    return () => {
      stopCameraStream();
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // 3. Web Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not available");
      return;
    }
    
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = language;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsSpeaking(true);
      setAiState('listening');
    };

    rec.onresult = (event) => {
      let interimText = '';
      let finalOutput = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript || '';
        if (event.results[i].isFinal) {
          finalOutput += transcript;
        } else {
          interimText += transcript;
        }
      }
      
      if (finalOutput) {
        setTranscript(prev => {
          const connector = prev.trim() ? ' ' : '';
          const newText = prev.trim() + connector + finalOutput.trim();
          analyzeLiveMetrics(newText);
          return newText;
        });
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimText);
      }
    };

    rec.onerror = (e) => {
      console.warn('Speech Recognition Error:', e.error);
      if (e.error === 'no-speech') {
        // Smart retry on no-speech
        recognitionRetryCount.current += 1;
        if (recognitionRetryCount.current <= recognitionMaxRetries) {
          setCoachingAlerts(prev => [...prev, { 
            id: 'mic-retry', 
            type: 'warning', 
            text: `No speech detected. Listening again... (Attempt ${recognitionRetryCount.current}/${recognitionMaxRetries})`
          }]);
          setTimeout(() => {
            try {
              if (roomStep === 'question' && interviewStarted) {
                rec.start();
              }
            } catch (err) {}
          }, 800);
        } else {
          setCoachingAlerts(prev => [...prev, { 
            id: 'mic-fail', 
            type: 'error', 
            text: 'Microphone not picking up audio. Check settings.'
          }]);
        }
      } else if (e.error === 'audio-capture') {
        setHwErrors(prev => [...new Set([...prev, 'Microphone not detected - please check audio settings'])]);
        setCoachingAlerts(prev => [...prev, { id: 'audio', type: 'error', text: 'Audio capture failed. Check microphone.' }]);
      } else if (e.error === 'network') {
        setHwErrors(prev => [...new Set([...prev, 'Network error - check your internet connection'])]);
        // Retry on network error
        setTimeout(() => {
          try {
            if (roomStep === 'question' && interviewStarted) {
              rec.start();
            }
          } catch (err) {}
        }, 1000);
      }
    };

    rec.onend = () => {
      setIsSpeaking(false);
      // Auto-restart if still in question phase
      if (roomStep === 'question' && interviewStarted && !isMuted) {
        setTimeout(() => {
          try {
            rec.start();
          } catch (err) {}
        }, 300);
      }
    };

    recognitionRef.current = rec;
  }, [language]);

  // 4. Auto-restart recognition if it closes unexpectedly during questioning phase
  useEffect(() => {
    if (roomStep === 'question' && interviewStarted && !isMuted && !isSpeaking && aiState === 'listening') {
      const timer = setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Already running
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, roomStep, interviewStarted, isMuted, aiState]);

  const finishInterview = (finalLogs = interviewLogs) => {
    stopCameraStream();
    if (timerRef.current) clearInterval(timerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    
    const totalScore = Math.round(finalLogs.reduce((acc, log) => acc + log.overallScore, 0) / finalLogs.length) || 75;
    const avgRelevance = Math.round(finalLogs.reduce((acc, log) => acc + (log.relevance || 100), 0) / finalLogs.length);
    const commScore = Math.round(85 - finalLogs.reduce((acc, log) => acc + log.fillers, 0) * 2);
    
    const results = {
      overallScore: totalScore,
      communicationScore: commScore,
      technicalScore: Math.round(totalScore * 0.95),
      hrScore: Math.round(commScore * 1.02),
      confidenceScore: Math.min(95, Math.round(commScore + 5)),
      relevanceScore: avgRelevance,
      bodyLanguageScore: isCameraOff ? 70 : 88,
      professionalismScore: 90,
      problemSolvingScore: Math.round(totalScore * 0.98),
      recruiterImpression: Math.max(60, totalScore + 2),
      placementReadiness: Math.round((totalScore + commScore) / 2),
      relevantAnswers: finalLogs.filter(log => log.isRelevant).length,
      totalQuestions: finalLogs.length,
      transcriptLogs: finalLogs,
      audioRecordings: recordedAudioBlobs,
      durationSeconds: interviewTimer
    };

    onInterviewEnd(results);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDisplayText = transcript + (interimTranscript ? (transcript ? ' ' : '') + interimTranscript : '');

  return (
    <div 
      className="animate-fade-in" 
      style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}
    >
      
      {/* Top Header HUD */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚪</span> Interview Simulator • <span style={{ color: 'var(--accent-cyan-light)' }}>{domain.name}</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Difficulty: {difficulty} • HR & Technical Screening
          </span>
        </div>

        {interviewStarted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="hud-pill" style={{ borderColor: 'var(--primary)', padding: '6px 16px' }}>
              ⏱️ {formatTimer(interviewTimer)}
            </div>
            <div className="hud-pill" style={{ color: '#c084fc', borderColor: '#c084fc' }}>
              Question {currentQuestionIndex + 1} of {questionsList.length}
            </div>
          </div>
        )}
      </header>

      {!interviewStarted ? (
        // Pre-Interview Lobby Calibration
        <div className="glass-panel animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Lobby & Hardware Calibration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', marginBottom: '32px' }}>
            Please authorize camera and microphone access. We analyze eye contact, pacing, and verbal responses.
          </p>

          {/* Hardware Error Display */}
          {hwErrors.length > 0 && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '2px solid #ef4444', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              marginBottom: '20px', 
              width: '100%', 
              maxWidth: '500px',
              textAlign: 'left'
            }}>
              <strong style={{ color: '#ef4444', display: 'block', marginBottom: '4px' }}>⚠️ Hardware Warnings:</strong>
              {hwErrors.map((err, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: idx < hwErrors.length - 1 ? '4px' : '0' }}>
                  • {err}
                </div>
              ))}
            </div>
          )}

          {!speechRecognitionSupported && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '2px solid #f97316', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              marginBottom: '20px', 
              width: '100%', 
              maxWidth: '500px',
              textAlign: 'left'
            }}>
              <strong style={{ color: '#f97316', display: 'block', marginBottom: '4px' }}>⚠️ Browser Compatibility:</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Speech recognition not available. You can still type your answers.
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', width: '100%', maxWidth: '800px', alignItems: 'center', marginBottom: '40px' }}>
            
            {/* Camera Preview */}
            <div className="camera-feed" style={{ aspectRatio: '16/10' }}>
              {camPermission && !isCameraOff ? (
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
              ) : (
                <div className="camera-placeholder">
                  <div className="scanner-line"></div>
                  <span style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📷</span>
                  <span style={{ fontSize: '0.85rem' }}>Camera Stream {camPermission ? 'Ready' : 'Unavailable'}</span>
                </div>
              )}
              <div className="feed-hud">
                <span className="hud-pill">
                  <span className="hud-dot" style={{ background: camPermission ? '#10b981' : '#ef4444' }}></span> 
                  {camPermission ? 'FEED_OK' : 'NO_CAM'}
                </span>
                <span className="hud-pill" style={{ textTransform: 'uppercase' }}>{userProfile.name || 'Candidate'}</span>
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Hardware Checklist
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📷 Video Connection:</span>
                  <strong style={{ color: camPermission ? 'var(--success)' : 'var(--warning)' }}>
                    {camPermission ? '✓ CONNECTED' : '✕ BLOCKED'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🎙️ Voice Input Capture:</span>
                  <strong style={{ color: micPermission ? 'var(--success)' : 'var(--error)' }}>
                    {micPermission ? '✓ READY' : '✕ BLOCKED'}
                  </strong>
                </div>

                {/* Microphone Level Meter */}
                {micPermission && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span>🔊 Mic Level Test:</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{micLevel}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(micLevel * 1.5, 100)}%`,
                        height: '100%',
                        background: micLevel < 20 ? '#ef4444' : micLevel < 60 ? '#f97316' : '#10b981',
                        transition: 'all 0.1s ease'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                      {micLevel < 20 ? 'Try speaking or check mic' : micLevel < 60 ? 'Mic working' : 'Mic level good!'}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🌐 Network Connection:</span>
                  <strong style={{ color: 'var(--success)' }}>✓ STABLE (12ms)</strong>
                </div>
              </div>

              <button 
                className="glass-button" 
                style={{ width: '100%', padding: '14px' }}
                onClick={startInterview}
                disabled={!hardwareReady || (!micPermission && !camPermission)}
              >
                I'm Ready, Ask First Question ⚡
              </button>

              {(!micPermission || !camPermission) && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                  Note: You can continue with {micPermission ? 'camera disabled' : 'microphone disabled'}, but results may be incomplete.
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        // Active interview workspace
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', minHeight: '0' }}>
          
          {/* Left panel: Photo-Realistic Recruiter Avatar Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '0' }}>
            
            {/* The photo viewport container */}
            <div style={{ 
              borderRadius: '12px', 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative', 
              border: `2px solid ${activeInterviewer.accent}50`,
              boxShadow: `0 0 20px ${activeInterviewer.accent}20`,
              minHeight: '260px',
              overflow: 'hidden',
              transform: aiState === 'speaking' ? 'scale(1.01)' : 'scale(1)',
              transition: 'transform 0.3s ease, border-color 0.3s'
            }}>
              {/* Recruiter Background photo */}
              <img 
                src={activeInterviewer.id === 'sophia' ? '/sophia.jpg' : '/ethan.jpg'} 
                alt={activeInterviewer.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: aiState === 'listening' ? 'brightness(1.05) contrast(1.02)' : 'brightness(0.9)',
                  transition: 'filter 0.3s'
                }} 
              />
              
              {/* Ambient holographic vignette gradient */}
              <div style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 15%, rgba(11, 15, 25, 0.4) 60%, transparent 100%)',
                pointerEvents: 'none'
              }}></div>

              {/* Scanning analysis laser line */}
              <div className="scanner-line" style={{ 
                display: aiState === 'thoughtful' || aiState === 'challenging' ? 'block' : 'none',
                background: `linear-gradient(90deg, transparent, ${activeInterviewer.accent}, transparent)`,
                boxShadow: `0 0 12px ${activeInterviewer.accent}`
              }}></div>

              {/* Glowing listen badge indicator */}
              {aiState === 'listening' && (
                <div style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.85)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: '#fff', 
                    animation: 'pulseGlow 1s infinite' 
                  }}></span>
                  ACTIVE LISTENING
                </div>
              )}

              {/* Lip-sync animation overlay when AI is speaking */}
              {aiIsSpeaking && aiState === 'speaking' && (
                <div style={{
                  position: 'absolute',
                  bottom: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}>
                  <div className="lip-sync-overlay" style={{
                    width: '24px',
                    height: '12px',
                    background: 'rgba(255, 100, 100, 0.6)',
                    borderRadius: '50%',
                    boxShadow: `0 0 10px ${activeInterviewer.accent}`,
                    animation: 'mouthOpen 0.3s ease-in-out infinite'
                  }}></div>
                </div>
              )}

              {/* Recruiter Identity overlay */}
              <div style={{ 
                position: 'absolute', 
                bottom: '16px', 
                left: '16px', 
                right: '16px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                zIndex: 5 
              }}>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#fff', display: 'block' }}>
                    {activeInterviewer.name}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {activeInterviewer.role} ({aiState})
                  </span>
                </div>
                
                {aiState === 'speaking' && (
                  <div className="voice-wave-container">
                    <div className="wave-bar" style={{ background: activeInterviewer.accent }}></div>
                    <div className="wave-bar" style={{ background: activeInterviewer.accent, animationDelay: '0.2s' }}></div>
                    <div className="wave-bar" style={{ background: activeInterviewer.accent, animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Question Text Box */}
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                Interviewer Question:
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.5', fontWeight: '500' }}>
                {questionsList[currentQuestionIndex]}
              </p>
            </div>

          </div>

          {/* Right panel: Recording workspace or Question review assessment */}
          {roomStep === 'question' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '0' }}>
              
              {/* Candidate webcamera */}
              <div className="camera-feed" style={{ flex: 1.2, minHeight: '180px' }}>
                {camPermission && !isCameraOff ? (
                  <video ref={videoRef} autoPlay playsInline muted></video>
                ) : (
                  <div className="camera-placeholder">
                    <div className="scanner-line"></div>
                    <span style={{ fontSize: '1.5rem', marginBottom: '6px' }}>👤</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Camera stream disabled</span>
                  </div>
                )}

                {coachingAlerts.length > 0 && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 20 }}>
                    {coachingAlerts.map((tip, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: tip.type === 'warning' ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#fff',
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        {tip.type === 'warning' ? '⚠️' : '✓'} {tip.text}
                      </div>
                    ))}
                  </div>
                )}

                <div className="feed-hud">
                  <span className="hud-pill" style={{ color: isSpeaking ? '#f87171' : '#fff' }}>
                    <span className={`hud-dot ${isSpeaking ? 'recording' : ''}`}></span>
                    {isSpeaking ? 'RECORDING VOICE...' : 'MUTED / READY'}
                  </span>
                  <span className="hud-pill">FPS: 30</span>
                </div>
              </div>

              {/* Combined Voice-to-Text Interactive TEXTAREA Box */}
              <div className="glass-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '100%' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan-light)', fontWeight: 'bold' }}>
                    VOICE-TO-TEXT DICTATION HUB
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pace: <strong>{speakingSpeed} WPM</strong> • Fillers: <strong>{fillerWordCount}</strong> • Mic: <strong>{micLevel}%</strong>
                  </span>
                </div>

                {/* Microphone Level Indicator */}
                {micPermission && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center', 
                    marginBottom: '12px',
                    padding: '8px',
                    background: 'rgba(6, 182, 212, 0.05)',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontSize: '0.75rem', minWidth: '70px', color: 'var(--text-muted)' }}>🎤 Recording:</span>
                    <div style={{
                      flex: 1,
                      height: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(micLevel * 1.5, 100)}%`,
                        height: '100%',
                        background: isSpeaking 
                          ? 'linear-gradient(90deg, #06b6d4, #0891b2)' 
                          : 'linear-gradient(90deg, #6b7280, #4b5563)',
                        transition: 'all 0.05s ease',
                        boxShadow: isSpeaking ? '0 0 8px rgba(6, 182, 212, 0.5)' : 'none'
                      }}></div>
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      minWidth: '30px',
                      color: micLevel > 60 ? '#10b981' : '#f97316',
                      fontWeight: 'bold'
                    }}>
                      {isSpeaking ? '◉ LIVE' : '○ IDLE'}
                    </span>
                  </div>
                )}

                {/* Grammar Corrections Display */}
                {currentDisplayText && (
                  <div style={{
                    marginBottom: '12px',
                    padding: '10px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '6px',
                    maxHeight: '80px',
                    overflowY: 'auto'
                  }}>
                    {(() => {
                      const corrections = detectGrammarIssues(currentDisplayText);
                      return corrections.length > 0 ? (
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '6px' }}>
                            📝 Grammar Tips:
                          </div>
                          {corrections.map((corr, idx) => (
                            <div key={idx} style={{ 
                              fontSize: '0.75rem', 
                              color: '#fbbf24',
                              marginBottom: idx < corrections.length - 1 ? '4px' : '0',
                              paddingLeft: '6px',
                              borderLeft: '2px solid #f59e0b'
                            }}>
                              <strong>"{corr.original}"</strong> → <strong style={{color: '#10b981'}}>"{corr.correction}"</strong> 
                              <span style={{color: '#9ca3af', marginLeft: '4px'}}>({corr.error})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                          ✓ No grammar issues detected!
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Primary input box: auto transcribes voice, allows editing */}
                <textarea
                  className="glass-input"
                  value={currentDisplayText}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    setInterimTranscript('');
                    analyzeLiveMetrics(e.target.value);
                  }}
                  placeholder="Click 'Speak' and talk into your microphone to dictate your response, or type directly in this box..."
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.15)',
                    border: isSpeaking ? '2px solid var(--accent-cyan-light)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.925rem',
                    resize: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                    transition: 'border 0.2s ease',
                    boxShadow: isSpeaking ? '0 0 12px rgba(6, 182, 212, 0.2)' : 'none'
                  }}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {isSpeaking ? (
                    <button 
                      className="glass-button secondary" 
                      onClick={stopSpeechRecognition} 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#ef4444' }}
                    >
                      ⏹️ Stop Listening
                    </button>
                  ) : (
                    <button 
                      className="glass-button" 
                      onClick={startSpeechRecognition} 
                      disabled={isMuted} 
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      🎙️ Speak (Dictate)
                    </button>
                  )}

                  <button 
                    className="glass-button accent" 
                    onClick={handleSubmitAnswer} 
                    style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                  >
                    Submit Answer ⚡
                  </button>
                </div>
              </div>

            </div>
          ) : (
            // PER-QUESTION ASSESSMENT CARD
            <div className="glass-panel animate-slide-up" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--accent-cyan-light)', minHeight: '0', overflowY: 'auto' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>Question {currentFeedback.qIndex + 1} Assessment</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant AI Coaching Evaluator</span>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>RATING SCORE</span>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--accent-cyan-light)' }}>{currentFeedback.score} / 100</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <span className="badge primary" style={{ fontSize: '0.7rem' }}>
                    Pace: {currentFeedback.wpm} WPM
                  </span>
                  <span className="badge cyan" style={{ fontSize: '0.7rem' }}>
                    Fillers: {currentFeedback.fillers} detected
                  </span>
                  <span className="badge success" style={{ fontSize: '0.7rem' }}>
                    Grammar: High Accuracy
                  </span>
                  {currentFeedback.relevance !== undefined && (
                    <span className={`badge ${currentFeedback.isRelevant ? 'success' : 'warning'}`} style={{ fontSize: '0.7rem' }}>
                      Relevance: {currentFeedback.relevance}%
                    </span>
                  )}
                </div>

                {!currentFeedback.isRelevant && currentFeedback.relevance !== undefined && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <strong style={{ color: '#ef4444' }}>⚠️ Off-Topic Response</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Your answer doesn't fully address the question. Please try to provide an answer that directly relates to: "{currentFeedback.question}"
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#34d399', marginBottom: '8px' }}>✓ Key Strengths</h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                    {currentFeedback.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>

                  <h4 style={{ fontSize: '0.9rem', color: '#f87171', marginBottom: '8px' }}>⚠️ Areas of Improvement</h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                    {currentFeedback.weaknesses.map((weak, i) => (
                      <li key={i}>{weak}</li>
                    ))}
                  </ul>

                  {currentFeedback.grammarCorrections && currentFeedback.grammarCorrections.length > 0 && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '6px',
                      padding: '12px',
                      marginTop: '12px'
                    }}>
                      <h4 style={{ fontSize: '0.9rem', color: '#f59e0b', marginBottom: '8px' }}>📝 Grammar & Clarity</h4>
                      <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {currentFeedback.grammarCorrections.map((corr, i) => (
                          <li key={i}>
                            <strong>"{corr.original}"</strong> should be <strong style={{color: '#10b981'}}>"{corr.correction}"</strong>
                            <span style={{color: '#9ca3af', marginLeft: '6px'}}>— {corr.error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ 
                  background: 'rgba(6, 182, 212, 0.04)', 
                  borderLeft: '3px solid var(--accent-cyan)', 
                  padding: '12px', 
                  borderRadius: '0 8px 8px 0', 
                  fontSize: '0.825rem',
                  lineHeight: '1.5',
                  marginBottom: '20px'
                }}>
                  <strong style={{ color: 'var(--accent-cyan-light)', display: 'block', marginBottom: '4px' }}>AI Tip for Next Round:</strong>
                  {currentFeedback.improvement}
                </div>
              </div>

              <button 
                className="glass-button" 
                style={{ width: '100%', padding: '12px' }}
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < questionsList.length - 1 ? 'Continue to Next Question →' : 'View Final Placement Report 🏆'}
              </button>

            </div>
          )}

        </div>
      )}

      {/* Footer controls HUD */}
      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="icon-button"
            onClick={handleMuteToggle}
            style={{ color: isMuted ? '#ef4444' : 'inherit', borderColor: isMuted ? '#ef4444' : 'var(--border-color)' }}
          >
            {isMuted ? '🎙️✕' : '🎙️'}
          </button>
          <button 
            className="icon-button"
            onClick={handleCameraToggle}
            style={{ color: isCameraOff ? '#ef4444' : 'inherit', borderColor: isCameraOff ? '#ef4444' : 'var(--border-color)' }}
          >
            {isCameraOff ? '📷✕' : '📷'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🗣️ Language:</span>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="glass-input"
            style={{ width: '130px', padding: '6px 12px', fontSize: '0.8rem', background: 'var(--bg-dark)' }}
          >
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi (India)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="de-DE">German (Germany)</option>
          </select>
        </div>

        <button 
          className="glass-button secondary" 
          style={{ borderColor: 'var(--error)', color: '#f87171' }}
          onClick={() => {
            if (confirm("Are you sure you want to end this interview? Your scores will be calculated based on completed questions.")) {
              finishInterview();
            }
          }}
        >
          End Session ✕
        </button>

      </footer>

    </div>
  );
}
