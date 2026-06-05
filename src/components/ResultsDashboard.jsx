import React, { useState } from 'react';

export default function ResultsDashboard({ results, onRestart, onViewCareerCoach }) {
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'transcripts'
  
  const {
    overallScore,
    communicationScore,
    technicalScore,
    hrScore,
    confidenceScore,
    bodyLanguageScore,
    professionalismScore,
    problemSolvingScore,
    recruiterImpression,
    placementReadiness,
    transcriptLogs,
    durationSeconds
  } = results;

  // 1. Radar Chart Setup (Calculated coordinates for an 8-axis radar polygon)
  // Axes: Technical, Communication, HR, Confidence, Body Language, Professionalism, Problem Solving, Impression
  const axes = [
    { label: 'Technical', val: technicalScore },
    { label: 'Comms', val: communicationScore },
    { label: 'HR Round', val: hrScore },
    { label: 'Confidence', val: confidenceScore },
    { label: 'Body Language', val: bodyLanguageScore },
    { label: 'Professionalism', val: professionalismScore },
    { label: 'Problem Solving', val: problemSolvingScore },
    { label: 'Recruiter Imp.', val: recruiterImpression }
  ];

  const cx = 150;
  const cy = 150;
  const r = 100; // max radius for 100 score
  const angleStep = (Math.PI * 2) / axes.length;

  // Calculate coordinates of the grid octagons
  const gridRadii = [20, 40, 60, 80, 100];
  
  // Calculate points for candidate score polygon
  const points = axes.map((axis, i) => {
    const radius = (axis.val / 100) * r;
    const angle = i * angleStep - Math.PI / 2; // Offset by 90deg to start at top
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return { x, y };
  });

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  // Help format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Mock grammar fixer replacements
  const getGrammarFix = (text) => {
    if (text.includes("Tell me about yourself") || text.toLowerCase().includes("fresher")) {
      return {
        original: text,
        improved: "I graduated from university focusing on React architectures and REST services. During my coursework, I developed an e-commerce dashboard resolving performance bottlenecks.",
        tip: "Avoid simple listing. Emphasize impact and metrics."
      };
    }
    return {
      original: text,
      improved: text.replace(/like|um|actually/gi, '').trim(),
      tip: "Structure answer using the STAR method: Situation, Task, Action, Result."
    };
  };

  return (
    <div className="animate-slide-up" style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Title Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem' }}>🎯 Session Assessment Report</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Interview completed in {formatDuration(durationSeconds)} • Review detailed speech logs and skill diagnostics.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-button secondary" onClick={onRestart}>
            ↩ Practice Again
          </button>
          <button className="glass-button" onClick={onViewCareerCoach}>
            ✨ Open AI Career Coach
          </button>
        </div>
      </section>

      {/* Main Grid: Radar chart on left, Metrics grid on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', marginBottom: '40px' }}>
        
        {/* Left Side: Score & Radar SVG Graph */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>OVERALL SCORE</span>
            <strong style={{ fontSize: '3rem', color: 'var(--accent-cyan-light)', fontFamily: 'var(--font-title)' }}>{overallScore}%</strong>
            <span className="badge success" style={{ marginTop: '8px' }}>Placement Ready</span>
          </div>

          {/* Custom SVG Radar Chart */}
          <svg width="300" height="300" style={{ background: 'transparent' }}>
            {/* Grid Octagons */}
            {gridRadii.map((gridR, idx) => {
              const gridPoints = axes.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = cx + gridR * Math.cos(angle);
                const y = cy + gridR * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ');

              return (
                <polygon 
                  key={idx} 
                  points={gridPoints} 
                  className="radar-grid" 
                  style={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
              );
            })}

            {/* Radar Axes Lines */}
            {axes.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x2 = cx + r * Math.cos(angle);
              const y2 = cy + r * Math.sin(angle);
              return (
                <line 
                  key={i} 
                  x1={cx} 
                  y1={cy} 
                  x2={x2} 
                  y2={y2} 
                  className="radar-axis" 
                  style={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
              );
            })}

            {/* Candidate Area Polygon */}
            <polygon points={pointsString} className="radar-area" />

            {/* Candidate Area Points */}
            {points.map((p, idx) => (
              <circle 
                key={idx} 
                cx={p.x} 
                cy={p.y} 
                r="4" 
                className="radar-point"
              />
            ))}

            {/* Labels */}
            {axes.map((axis, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const labelRadius = r + 22;
              const x = cx + labelRadius * Math.cos(angle) - 20;
              const y = cy + labelRadius * Math.sin(angle) + 4;
              return (
                <text 
                  key={i} 
                  x={x} 
                  y={y} 
                  fill="var(--text-muted)" 
                  fontSize="9.5" 
                  fontWeight="600"
                >
                  {axis.label}
                </text>
              );
            })}
          </svg>

        </div>

        {/* Right Side: Detailed Progress Meters Grid */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <button
              style={{
                background: 'none', border: 'none', padding: '12px 20px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold',
                color: activeTab === 'metrics' ? 'var(--accent-cyan-light)' : 'var(--text-muted)',
                borderBottom: activeTab === 'metrics' ? '3px solid var(--accent-cyan)' : 'none'
              }}
              onClick={() => setActiveTab('metrics')}
            >
              Performance Metrics
            </button>
            <button
              style={{
                background: 'none', border: 'none', padding: '12px 20px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold',
                color: activeTab === 'transcripts' ? 'var(--accent-cyan-light)' : 'var(--text-muted)',
                borderBottom: activeTab === 'transcripts' ? '3px solid var(--accent-cyan)' : 'none'
              }}
              onClick={() => setActiveTab('transcripts')}
            >
              Speech Transcripts Review
            </button>
          </div>

          {activeTab === 'metrics' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {axes.map((axis, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                    <span>{axis.label} Score</span>
                    <strong style={{ color: 'var(--accent-cyan-light)' }}>{axis.val}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${axis.val}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--accent-cyan-light))' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Transcripts & Grammar Fix list
            <div style={{ maxHeight: '340px', overflowY: 'auto', paddingRight: '10px' }}>
              {transcriptLogs.map((log, idx) => {
                const fix = getGrammarFix(log.answer);
                return (
                  <div key={idx} style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <p style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Q{idx + 1}: {log.question}
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
                      <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', padding: '10px' }}>
                        <strong style={{ color: '#f87171', display: 'block', marginBottom: '4px' }}>Your Answer:</strong>
                        <p style={{ color: 'var(--text-muted)' }}>"{log.answer}"</p>
                      </div>
                      
                      <div style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '8px', padding: '10px' }}>
                        <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>AI Recommended Revision:</strong>
                        <p style={{ color: 'var(--text-main)' }}>"{fix.improved}"</p>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--accent-cyan-light)', background: 'var(--accent-cyan-glow)', padding: '6px 12px', borderRadius: '4px' }}>
                      💡 <strong>Coaching Feedback:</strong> {fix.tip}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
