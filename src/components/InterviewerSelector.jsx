import React from 'react';

const INTERVIEWERS = [
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Senior HR Director',
    gender: 'female',
    avatarColor: '#ec4899',
    voice: 'US Female (Attentive)',
    traits: ['Structured Flow', 'Attentive Listening', 'Analytical Assessment'],
    bio: 'Sophia has over 12 years of executive recruiting experience at Fortune 500 tech firms. Her interview style is structured, calm, and focuses heavily on culture fit, behavioral traits, and long-term career orientation.',
    accent: '#06b6d4'
  },
  {
    id: 'ethan',
    name: 'Ethan',
    role: 'Lead Technical Recruiter',
    gender: 'male',
    avatarColor: '#3b82f6',
    voice: 'US Male (Challenging)',
    traits: ['Deep Tech Probes', 'Dynamic Follow-ups', 'Pace Challenger'],
    bio: 'Ethan specializes in rapid engineering recruitment and startup architectures. He focuses on technical reasoning, system scalability, and core problem-solving capacity, frequently challenging candidate design decisions.',
    accent: '#7c3aed'
  }
];

export default function InterviewerSelector({ onSelect, onBack }) {
  return (
    <div className="animate-slide-up" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      
      <div className="badge primary" style={{ marginBottom: '16px' }}>
        Step 2 of 3 • Selection Panel
      </div>
      
      <h2 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Select Your AI HR Interviewer</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>
        Each interviewer represents a unique corporate style and grading bias. Choose the partner that aligns with your practice goals.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
        
        {INTERVIEWERS.map((interviewer) => (
          <div 
            key={interviewer.id}
            className="glass-panel" 
            style={{ 
              padding: '32px', 
              textAlign: 'left', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderTop: `4px solid ${interviewer.accent}`
            }}
          >
            <div>
              {/* Real profile image */}
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                border: `2px solid ${interviewer.accent}`,
                marginBottom: '20px',
                overflow: 'hidden',
                boxShadow: `0 0 15px ${interviewer.accent}35`
              }}>
                <img 
                  src={interviewer.id === 'sophia' ? '/sophia.jpg' : '/ethan.jpg'} 
                  alt={interviewer.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'avatarBreathing 3.5s ease-in-out infinite'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{interviewer.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: interviewer.accent, fontWeight: 'bold' }}>{interviewer.role}</span>
                </div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                  {interviewer.voice}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                {interviewer.bio}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {interviewer.traits.map((trait, idx) => (
                  <span 
                    key={idx} 
                    className="badge" 
                    style={{ 
                      fontSize: '0.7rem', 
                      background: `${interviewer.accent}12`, 
                      color: interviewer.accent,
                      border: `1px solid ${interviewer.accent}30` 
                    }}
                  >
                    ✦ {trait}
                  </span>
                ))}
              </div>
            </div>

            <button 
              className="glass-button" 
              style={{ width: '100%', background: `linear-gradient(135deg, ${interviewer.accent}, #0f172a)` }}
              onClick={() => onSelect(interviewer)}
            >
              Select & Enter Lobby ⚡
            </button>
          </div>
        ))}

      </div>

      <button className="glass-button secondary" onClick={onBack}>
        ← Back to Dashboard
      </button>

    </div>
  );
}
