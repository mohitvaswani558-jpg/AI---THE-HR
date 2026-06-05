import React, { useState } from 'react';

export default function LandingPage({ onGetStarted, onLoginClick }) {
  // Placement Readiness Interactive State
  const [dsa, setDsa] = useState(65);
  const [sysDesign, setSysDesign] = useState(40);
  const [softSkills, setSoftSkills] = useState(70);
  const [coreTech, setCoreTech] = useState(55);
  const [behavioral, setBehavioral] = useState(60);

  // Dynamic score calculator
  const overallScore = Math.round((dsa * 0.25) + (sysDesign * 0.2) + (softSkills * 0.25) + (coreTech * 0.15) + (behavioral * 0.15));

  // Determine feedback based on score
  const getReadinessLevel = (score) => {
    if (score < 50) return { label: 'Needs Practice', color: '#ef4444' };
    if (score < 75) return { label: 'Intermediate Ready', color: '#f59e0b' };
    if (score < 90) return { label: 'Placement Ready', color: '#06b6d4' };
    return { label: 'FAANG / Expert Level', color: '#10b981' };
  };

  const readiness = getReadinessLevel(overallScore);

  return (
    <div className="animate-slide-up" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', margin: '60px 0 100px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'var(--primary-glow)', filter: 'blur(50px)', borderRadius: '50%', zIndex: -1 }}></div>
        
        <div className="badge primary" style={{ marginBottom: '24px' }}>
          🚀 Launching ElevateAI v2.0
        </div>
        
        <h1 style={{ 
          fontSize: '3.75rem', 
          lineHeight: '1.1', 
          fontWeight: '800', 
          marginBottom: '24px',
          background: 'linear-gradient(to right, #ffffff, #e2e8f0, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Practice Interviews <br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan-light), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Like They’re Real.
          </span>
        </h1>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-muted)', 
          maxWidth: '720px', 
          margin: '0 auto 40px auto', 
          lineHeight: '1.6' 
        }}>
          Prepare for placements and job interviews through AI-powered human-like interview simulations with real-time coaching and career intelligence.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="glass-button" style={{ fontSize: '1.1rem', padding: '14px 32px' }} onClick={onGetStarted}>
            Start Free Mock Interview ⚡
          </button>
          <button className="glass-button secondary" style={{ fontSize: '1.1rem', padding: '14px 32px' }} onClick={onLoginClick}>
            Sign In to Workspace
          </button>
        </div>
      </section>

      {/* Main Interactive Preview Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px', 
        marginBottom: '100px',
        alignItems: 'center' 
      }}>
        
        {/* Left Col: Futuristic AI Interview Room Mockup */}
        <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <div className="hud-pill" style={{ color: 'var(--accent-cyan-light)', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'var(--accent-cyan-glow)' }}>
              🔴 SIMULATION ON AIR
            </div>
          </div>

          {/* HR Avatar Mock Container */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            
            {/* The Avatar Display */}
            <div style={{ background: '#090d16', borderRadius: '12px', height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
              <div className="scanner-line"></div>
              
              {/* Realistic image of avatar face */}
              <img 
                src="/sophia.jpg" 
                alt="Sophia HR Interviewer"
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: '2px solid var(--accent-cyan-light)', 
                  boxShadow: 'var(--shadow-cyan)',
                  animation: 'avatarBreathing 3.5s ease-in-out infinite' 
                }} 
              />
              
              <div style={{ position: 'absolute', bottom: '12px', textAlign: 'center', width: '100%' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Sophia — Senior HR Director</p>
                <div className="voice-wave-container" style={{ marginTop: '8px' }}>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              </div>
            </div>

            {/* AI Real-time Analytics Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>COMMS CLARITY</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-cyan-light)' }}>94%</strong>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '94%', height: '100%', background: 'var(--accent-cyan)' }}></div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>FILLER WORDS (UM/LIKE)</span>
                <strong style={{ fontSize: '1.25rem', color: '#f87171' }}>1.8%</strong>
                <span style={{ fontSize: '0.65rem', color: '#34d399', display: 'block', marginTop: '4px' }}>✓ Exceptional Control</span>
              </div>

              <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>SPEAKING PACE</span>
                <strong style={{ fontSize: '1.25rem', color: '#34d399' }}>130 WPM</strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Perfect conversational rate</span>
              </div>

            </div>

          </div>

          {/* Dialog Bubble */}
          <div style={{ 
            marginTop: '20px', 
            background: 'rgba(124, 58, 237, 0.1)', 
            border: '1px solid rgba(124, 58, 237, 0.2)', 
            borderRadius: '8px', 
            padding: '12px',
            fontSize: '0.875rem',
            lineHeight: '1.4'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Interviewer:</strong> "Tell me about a challenging technical situation you encountered in your last project, and how you navigated it."
          </div>
        </div>

        {/* Right Col: Placement Readiness Meter Interactivity */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Placement Readiness Meter</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Adjust your target skills below to calculate your job-readiness index and dream company compatibility.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'center' }}>
            
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Data Structures & Algorithms</span>
                  <strong>{dsa}%</strong>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={dsa} 
                  onChange={(e) => setDsa(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>System Design & Architecture</span>
                  <strong>{sysDesign}%</strong>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={sysDesign} 
                  onChange={(e) => setSysDesign(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Soft Skills & Eye Contact</span>
                  <strong>{softSkills}%</strong>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={softSkills} 
                  onChange={(e) => setSoftSkills(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Core Tech (DBMS/OS/Networks)</span>
                  <strong>{coreTech}%</strong>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={coreTech} 
                  onChange={(e) => setCoreTech(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Behavioral (HR & Teamwork)</span>
                  <strong>{behavioral}%</strong>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={behavioral} 
                  onChange={(e) => setBehavioral(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>

            {/* Circular Gauge Display */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                
                {/* SVG Gauge Background & Progress */}
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="58" stroke="var(--border-color)" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="70" 
                    cy="70" 
                    r="58" 
                    stroke={readiness.color} 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * overallScore) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s' }}
                  />
                </svg>

                {/* Score text inside Gauge */}
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-title)' }}>{overallScore}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '-4px' }}>READINESS</span>
                </div>

              </div>

              <div style={{ 
                marginTop: '16px', 
                padding: '4px 12px', 
                borderRadius: '8px', 
                fontSize: '0.875rem', 
                fontWeight: 'bold', 
                background: `${readiness.color}18`, 
                color: readiness.color,
                border: `1px solid ${readiness.color}35`,
                textAlign: 'center'
              }}>
                {readiness.label}
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Trust & Placement Statistics Grid */}
      <section style={{ marginBottom: '100px' }}>
        <h3 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '40px' }}>
          Empowering candidates at top placement structures
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          
          <div className="glass-panel animate-float" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), transparent)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-cyan-light)', fontFamily: 'var(--font-title)', marginBottom: '8px' }}>
              12,850+
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
              Interviews Completed
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-time voice and behavioral sessions recorded.
            </p>
          </div>

          <div className="glass-panel animate-float" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), transparent)', animationDelay: '1.5s' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)', fontFamily: 'var(--font-title)', marginBottom: '8px' }}>
              94.8%
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
              Success Rate
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Candidates clearing real rounds within 90 days.
            </p>
          </div>

          <div className="glass-panel animate-float" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), transparent)', animationDelay: '3s' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-title)', marginBottom: '8px' }}>
              +32%
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
              Avg. Confidence Boost
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Improvement measured across consecutive sessions.
            </p>
          </div>

          <div className="glass-panel animate-float" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), transparent)', animationDelay: '4.5s' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b', fontFamily: 'var(--font-title)', marginBottom: '8px' }}>
              15+
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
              Supported Domains
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              From SWE to Medical, Consulting and Sales.
            </p>
          </div>

        </div>
      </section>

      {/* Feature Blocks */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '80px' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🤖</div>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Interactive Human Avatars</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Our custom animated AI HR panels exhibit eye tracking, blinking, micro-gestures, and mouth sync responses to bring the tension of a real hiring round to life.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚡</div>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Real-time Cognitive Coaching</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Get instant feedback on your vocal metrics. Detect grammar mistakes, pace constraints, fillers, and confidence gaps on-the-fly while answering questions.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📊</div>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Advanced Placement Radar</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Break down performance using multi-dimensional visual profiles, speech transcripts corrections, resume matches, and target recommendations.
          </p>
        </div>
      </section>

    </div>
  );
}
