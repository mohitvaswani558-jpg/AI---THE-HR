import React, { useState } from 'react';

export default function ProfileModal({ isOpen, onClose, onProfileSave, initialData = {} }) {
  const [name, setName] = useState(initialData.name || '');
  const [education, setEducation] = useState(initialData.education || 'Bachelor of Technology');
  const [college, setCollege] = useState(initialData.college || '');
  const [gradYear, setGradYear] = useState(initialData.gradYear || '2027');
  const [skills, setSkills] = useState(initialData.skills || '');
  const [experience, setExperience] = useState(initialData.experience || 'Fresher');
  const [industry, setIndustry] = useState(initialData.industry || 'Software Engineering');
  const [targetCompanies, setTargetCompanies] = useState(initialData.targetCompanies || '');
  const [dreamRole, setDreamRole] = useState(initialData.dreamRole || '');
  
  // Resume Parsing States
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parseStatus, setParseStatus] = useState('');

  if (!isOpen) return null;

  // Mock Resume Analyzer
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setParsing(true);
    setParseStatus('Uploading document...');

    setTimeout(() => {
      setParseStatus('Parsing PDF structures...');
      setTimeout(() => {
        setParseStatus('AI extracting entities & core skills...');
        setTimeout(() => {
          setParsing(false);
          setParseStatus('');
          
          // Auto-fill values based on file type or defaults
          const parsedSkills = 'React.js, Node.js, Python, PostgreSQL, REST APIs, Git, Data Structures';
          setSkills(parsedSkills);
          if (!college) setCollege('Global Institute of Technology');
          if (!dreamRole) setDreamRole('Associate Software Engineer');
          if (!targetCompanies) setTargetCompanies('Google, Microsoft, Amazon');
          
          alert('AI Analysis Successful! We have extracted 7 core skills and auto-filled your profile fields.');
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !college || !dreamRole) {
      alert('Please fill out Name, College, and Dream Job Role.');
      return;
    }

    onProfileSave({
      name,
      education,
      college,
      gradYear,
      skills,
      experience,
      industry,
      targetCompanies,
      dreamRole,
      resumeAnalyzed: !!fileName
    });
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Professional Profile Setup</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Enter your career goals. Our AI Interviewers will customize questions based on this profile.
          </p>
        </div>

        <form onSubmit={handleSave}>
          
          {/* Resume Upload Box */}
          <div style={{ 
            border: '2px dashed var(--border-color)', 
            borderRadius: '12px', 
            padding: '20px', 
            textAlign: 'center', 
            marginBottom: '24px',
            background: parsing ? 'rgba(124, 58, 237, 0.03)' : 'rgba(255, 255, 255, 0.01)',
            borderColor: parsing ? 'var(--primary)' : 'var(--border-color)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
            <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>AI Resume Analyzer</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Drag & drop your resume (PDF/DOCX) to auto-extract skills & experience in real time.
            </p>
            
            <input 
              type="file" 
              id="resume-file" 
              accept=".pdf,.docx,.doc" 
              style={{ display: 'none' }}
              onChange={handleResumeUpload}
              disabled={parsing}
            />

            {parsing ? (
              <div>
                <div className="voice-wave-container" style={{ margin: '12px 0' }}>
                  <div className="wave-bar" style={{ animationDuration: '0.6s' }}></div>
                  <div className="wave-bar" style={{ animationDuration: '0.8s' }}></div>
                  <div className="wave-bar" style={{ animationDuration: '0.5s' }}></div>
                  <div className="wave-bar" style={{ animationDuration: '0.7s' }}></div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>{parseStatus}</span>
              </div>
            ) : (
              <div>
                <label 
                  htmlFor="resume-file" 
                  className="glass-button secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {fileName ? 'Re-upload Resume' : 'Select Resume File'}
                </label>
                {fileName && (
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--success)', marginTop: '8px', fontWeight: '600' }}>
                    ✓ {fileName} analyzed successfully!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Core Profile Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
              <input 
                type="text" 
                className="glass-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Experience Level</label>
              <select 
                className="glass-input" 
                value={experience} 
                onChange={(e) => setExperience(e.target.value)}
                style={{ background: 'var(--bg-dark)' }}
              >
                <option value="Fresher">Fresher / Student</option>
                <option value="Junior (1-2 yrs)">Junior Professional (1-2 yrs)</option>
                <option value="Mid-Level (3-5 yrs)">Mid-Level Professional (3-5 yrs)</option>
                <option value="Senior (5+ yrs)">Senior Professional (5+ yrs)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>College / University</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="e.g. Stanford University"
                value={college} 
                onChange={(e) => setCollege(e.target.value)} 
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Graduation Year</label>
              <input 
                type="number" 
                className="glass-input" 
                value={gradYear} 
                onChange={(e) => setGradYear(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Dream Job Role</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="e.g. Frontend Engineer, Product Manager"
                value={dreamRole} 
                onChange={(e) => setDreamRole(e.target.value)} 
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Preferred Industry</label>
              <select 
                className="glass-input" 
                value={industry} 
                onChange={(e) => setIndustry(e.target.value)}
                style={{ background: 'var(--bg-dark)' }}
              >
                <option value="Software Engineering">Software Engineering / Tech</option>
                <option value="Data Science & AI">Data Science & AI / ML</option>
                <option value="Finance & Banking">Finance & Banking</option>
                <option value="Product & Consulting">Product Management & Consulting</option>
                <option value="Healthcare & Medical">Healthcare & Medical</option>
                <option value="Core Engineering">Mechanical / Civil / Electrical</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Technical / Professional Skills (Comma separated)</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="React, Python, SQL, Project Management..."
              value={skills} 
              onChange={(e) => setSkills(e.target.value)} 
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Target Companies (Comma separated)</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Google, Microsoft, Deloitte..."
              value={targetCompanies} 
              onChange={(e) => setTargetCompanies(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="glass-button secondary" onClick={onClose} disabled={parsing}>
              Cancel
            </button>
            <button type="submit" className="glass-button" disabled={parsing}>
              Save Professional Profile ⚡
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
