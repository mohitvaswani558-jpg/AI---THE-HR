import React from 'react';

export default function CareerCoach({ results, userProfile, onRestart }) {
  const { overallScore, technicalScore, communicationScore } = results;

  // Determine study milestones based on user performance
  const roadmapSteps = [
    {
      title: "Consolidate Foundation Concepts",
      desc: "Focus on algorithmic complexity (Big O), tree traversals (DFS/BFS), and database optimization principles.",
      duration: "Week 1 - 2",
      status: technicalScore > 75 ? "completed" : "pending"
    },
    {
      title: "System Design Mock Drills",
      desc: "Practice scaling distributed storage. Study load balancers, caching strategies, and message queues (Kafka).",
      duration: "Week 3",
      status: "pending"
    },
    {
      title: "Vocal Confidence & Speed Pacing",
      desc: "Practice behavioral rounds using the STAR method. Target 120-140 WPM. Control filler words.",
      duration: "Week 4",
      status: communicationScore > 80 ? "completed" : "pending"
    },
    {
      title: "Target Company Simulation",
      desc: `Simulate mock interviews for specific targets: ${userProfile.targetCompanies || "Google, Deloitte"}.`,
      duration: "Week 5",
      status: "pending"
    }
  ];

  return (
    <div className="animate-slide-up" style={{ padding: '30px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Title Header */}
      <div className="badge primary" style={{ marginBottom: '16px' }}>
        🔮 AI CAREER INTELLIGENCE HUB
      </div>
      
      <h2 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Personalized Career Roadmap</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '4px' }}>
        Based on your interview for <strong style={{ color: 'var(--accent-cyan-light)' }}>{userProfile.dreamRole || "Software Engineer"}</strong>.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '40px' }}>
        We have designed an optimization roadmap to elevate your placement readiness to 95%+.
      </p>

      {/* Main Grid split: Roadmap on left, Resume & Company Prep on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr', gap: '30px', marginBottom: '40px' }}>
        
        {/* Left Col: Step-by-Step Learning Timeline */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Study Roadmap</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {/* Vertical line through timeline */}
            <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)', zIndex: 1 }}></div>

            {roadmapSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2 }}>
                
                {/* Milestone Node */}
                <div style={{ 
                  width: '34px', 
                  height: '34px', 
                  borderRadius: '50%', 
                  background: step.status === 'completed' ? 'var(--success)' : 'var(--bg-dark)', 
                  border: '2px solid',
                  borderColor: step.status === 'completed' ? 'var(--success)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: step.status === 'completed' ? '#fff' : 'var(--primary)'
                }}>
                  {step.status === 'completed' ? '✓' : idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{step.title}</h4>
                    <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>{step.duration}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.desc}</p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Resume Checklist & Target Strategy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Resume Polish Checklists */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Resume Polish Checklist</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--success)' }}>✔</span>
                <span>Highlight React hooks and system design architectures.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--success)' }}>✔</span>
                <span>Incorporate metrics (e.g., "reduced api response load by 24%").</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)' }}>☐</span>
                <span style={{ color: 'var(--text-muted)' }}>Include clear links to GitHub and portfolio systems.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)' }}>☐</span>
                <span style={{ color: 'var(--text-muted)' }}>Detail team collaborative tasks rather than solo tasks.</span>
              </div>
            </div>
          </div>

          {/* Target Company prep strategy */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Target Company Prep</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              For <strong>{userProfile.targetCompanies || "Google, Microsoft"}</strong>, focus heavily on system load distributions, data structures correctness, and behavioral alignment.
            </p>
            
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--accent-cyan)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--accent-cyan-light)' }}>
              💡 <strong>Hiring Manager Tip:</strong> Interviewers at these levels value candidates who articulate trade-offs clearly. Don't just pick one design; discuss why.
            </div>
          </div>

        </div>

      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="glass-button" style={{ padding: '12px 36px', fontSize: '1.05rem' }} onClick={onRestart}>
          ↩ Exit Coach & Re-practice
        </button>
      </div>

    </div>
  );
}
