import React, { useState } from 'react';

const DOMAINS = [
  { id: 'swe', name: 'Software Engineering', icon: '💻', color: '#7c3aed' },
  { id: 'cyber', name: 'Cyber Security', icon: '🛡️', color: '#ef4444' },
  { id: 'datasci', name: 'Data Science', icon: '📊', color: '#06b6d4' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🧠', color: '#10b981' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖', color: '#3b82f6' },
  { id: 'banking', name: 'Banking & Core', icon: '🏦', color: '#f59e0b' },
  { id: 'finance', name: 'Finance & Accounts', icon: '📈', color: '#ec4899' },
  { id: 'business', name: 'Business Operations', icon: '💼', color: '#8b5cf6' },
  { id: 'hr', name: 'Human Resources', icon: '👥', color: '#14b8a6' },
  { id: 'marketing', name: 'Digital Marketing', icon: '📢', color: '#f43f5e' },
  { id: 'sales', name: 'Sales & Growth', icon: '🤝', color: '#84cc16' },
  { id: 'pharmacy', name: 'Pharmacy Practice', icon: '💊', color: '#d946ef' },
  { id: 'medical', name: 'Medical Clinical', icon: '🩺', color: '#f43f5e' },
  { id: 'mechanical', name: 'Mechanical Eng.', icon: '⚙️', color: '#6b7280' },
  { id: 'civil', name: 'Civil Engineering', icon: '🏗️', color: '#a1a1aa' },
  { id: 'electrical', name: 'Electrical Eng.', icon: '⚡', color: '#fbbf24' },
  { id: 'gov', name: 'Government Jobs', icon: '🏛️', color: '#4f46e5' },
  { id: 'consulting', name: 'Management Consulting', icon: '🧩', color: '#2563eb' },
  { id: 'pm', name: 'Product Management', icon: '🎯', color: '#db2777' }
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Company Specific'];

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta',
  'Deloitte', 'Accenture', 'Infosys', 'TCS', 'Wipro',
  'Goldman Sachs', 'JP Morgan'
];

export default function Dashboard({ userProfile, onEditProfile, onLaunchInterview }) {
  const [selectedDomain, setSelectedDomain] = useState('swe');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Mock Gamification data
  const xp = 680;
  const streakCount = 5;
  const level = Math.floor(xp / 200) + 1;
  const nextLevelXp = level * 200;
  const prevLevelXp = (level - 1) * 200;
  const levelPercent = Math.round(((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100);

  // Generate GitHub contribution heatmap cell list
  const heatmapCells = Array.from({ length: 96 }, (_, i) => {
    let level = 0;
    // Add random contributions
    if (i % 7 === 0 || i % 13 === 0) level = 1;
    if (i % 9 === 0 || i % 19 === 0) level = 2;
    if (i % 23 === 0) level = 3;
    if (i === 92 || i === 85 || i === 78) level = 4; // Recent high efforts
    return level;
  });

  const handleLaunch = () => {
    onLaunchInterview({
      domain: DOMAINS.find(d => d.id === selectedDomain),
      difficulty: difficulty === 'Company Specific' ? `Company: ${selectedCompany}` : difficulty
    });
  };

  return (
    <div className="animate-slide-up" style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Upper Dashboard HUD */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px', marginBottom: '32px' }}>
        
        {/* User Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.75rem' }}>Hi, {userProfile.name || 'Candidate'}</h2>
              <span className="badge primary">Level {level} Elite</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              🎯 Target: <strong>{userProfile.dreamRole || 'Software Engineer'}</strong> at {userProfile.targetCompanies || 'Top Tech Companies'}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
              🎓 {userProfile.education || 'B.Tech'} • {userProfile.college || 'Unconfigured University'} ({userProfile.gradYear || '2027'})
            </p>
            <button 
              className="glass-button secondary" 
              style={{ marginTop: '16px', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={onEditProfile}
            >
              ⚙️ Update Profile & Resume
            </button>
          </div>

          <div style={{ textAlign: 'right', minWidth: '150px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>XP progress</div>
            <strong>{xp} / {nextLevelXp} XP</strong>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', margin: '8px 0', overflow: 'hidden' }}>
              <div style={{ width: `${levelPercent}%`, height: '100%', background: 'var(--primary)' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{nextLevelXp - xp} XP to level up</span>
          </div>
        </div>

        {/* Gamification Streak & Leaderboard Access */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          
          {/* Streak Counter */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🔥</div>
            <strong style={{ fontSize: '1.5rem', display: 'block' }}>{streakCount} Days</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Streak</span>
          </div>

          <div style={{ height: '50px', width: '1px', background: 'var(--border-color)' }}></div>

          {/* Leaderboard CTA */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🏆</div>
            <button 
              className="glass-button secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => setShowLeaderboard(true)}
            >
              Rank #42
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Global Leaderboard</span>
          </div>

        </div>

      </section>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Left Side: Select Domain & Difficulty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Domains selector */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Select Interview Domain</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
              Choose a discipline. Technical questions will be pulled from matching database indexes.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', 
              gap: '12px',
              maxHeight: '340px',
              overflowY: 'auto',
              paddingRight: '6px'
            }}>
              {DOMAINS.map((domain) => (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: selectedDomain === domain.id ? domain.color : 'var(--border-color)',
                    background: selectedDomain === domain.id ? `${domain.color}15` : 'rgba(255, 255, 255, 0.01)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: selectedDomain === domain.id ? `0 0 10px ${domain.color}25` : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.75rem' }}>{domain.icon}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>{domain.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty System Selector */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Configure Difficulty Level</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
              Pick a baseline target or choose a specific company to test against real screening questions.
            </p>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  type="button"
                  style={{
                    flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600',
                    background: difficulty === level ? 'var(--primary)' : 'transparent',
                    color: difficulty === level ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            {difficulty === 'Company Specific' && (
              <div className="animate-fade-in">
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Select Target Placement Board
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                  gap: '10px',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  paddingRight: '6px'
                }}>
                  {COMPANIES.map((company) => (
                    <div
                      key={company}
                      onClick={() => setSelectedCompany(company)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: selectedCompany === company ? 'var(--accent-cyan-light)' : 'var(--border-color)',
                        background: selectedCompany === company ? 'var(--accent-cyan-glow)' : 'rgba(255,255,255,0.01)',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="glass-button" 
              style={{ width: '100%', marginTop: '24px', fontSize: '1.1rem' }}
              onClick={handleLaunch}
            >
              Launch Interview Environment 🚀
            </button>
          </div>

        </div>

        {/* Right Side: Streaks, Heatmap, Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Consistency Heatmap */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Interview Consistency</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '16px' }}>
              Your session heatmap over the last 90 days.
            </span>

            <div className="heatmap-grid" style={{ marginBottom: '12px' }}>
              {heatmapCells.map((level, idx) => (
                <div 
                  key={idx} 
                  className={`heatmap-cell level-${level}`}
                  title={`Completed sessions`}
                ></div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>90 days ago</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span>Less</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(255,255,255,0.03)' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(124, 58, 237, 0.2)' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(124, 58, 237, 0.5)' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(124, 58, 237, 1)' }}></div>
                <span>More</span>
              </div>
              <span>Today</span>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Unlocked Achievements</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', border: '1px solid rgba(124, 58, 237, 0.4)' }}>
                  🎯
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>First Wave</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed your first mock session.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                  🧠
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Technical Guru</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answered 5 technical questions correctly.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  ⚡
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Streak Master</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintained a 5-day session consistency.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: '0.4' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', border: '1px solid var(--border-color)' }}>
                  👑
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Perfect Score</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Get a score &gt;95% in an interview.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Leaderboard Modal Popup */}
      {showLeaderboard && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowLeaderboard(false)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <button className="modal-close" onClick={() => setShowLeaderboard(false)}>&times;</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', textAlign: 'center' }}>🏆 Global Leaderboard</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '20px' }}>
              Highest XP scores recorded across active universities this week.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { rank: 1, name: 'Siddharth Sharma', college: 'IIT Delhi', xp: 2450, tag: '🥇' },
                { rank: 2, name: 'Emma Watson', college: 'Stanford', xp: 2200, tag: '🥈' },
                { rank: 3, name: 'Rajesh Nair', college: 'BITS Pilani', xp: 1980, tag: '🥉' },
                { rank: 4, name: 'Priya Gopalan', college: 'VIT Vellore', xp: 1850 },
                { rank: 42, name: `${userProfile.name || 'You'}`, college: `${userProfile.college || 'GIT'}`, xp: xp, isSelf: true }
              ].map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: '8px',
                    background: member.isSelf ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                    border: member.isSelf ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <strong style={{ width: '24px', color: member.isSelf ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {member.tag || member.rank}
                    </strong>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: member.isSelf ? 'var(--primary-light)' : 'var(--text-main)' }}>
                        {member.name}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.college}</span>
                    </div>
                  </div>
                  <strong>{member.xp} XP</strong>
                </div>
              ))}
            </div>

            <button 
              className="glass-button secondary" 
              style={{ width: '100%', marginTop: '20px' }}
              onClick={() => setShowLeaderboard(false)}
            >
              Close Leaderboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
