import React, { useState, useEffect } from 'react';

// Component Imports
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import Dashboard from './components/Dashboard';
import InterviewerSelector from './components/InterviewerSelector';
import InterviewRoom from './components/InterviewRoom';
import ResultsDashboard from './components/ResultsDashboard';
import CareerCoach from './components/CareerCoach';

export default function App() {
  // Navigation states: 'landing' | 'dashboard' | 'selector' | 'room' | 'results' | 'coach'
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Theme & Language
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [globalLang, setGlobalLang] = useState('en-US');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Authentication State
  const [user, setUser] = useState(null);
  
  // Profile Details
  const [profile, setProfile] = useState({
    name: '',
    education: 'Bachelor of Technology',
    college: '',
    gradYear: '2027',
    skills: '',
    experience: 'Fresher',
    industry: 'Software Engineering',
    targetCompanies: '',
    dreamRole: '',
    resumeAnalyzed: false
  });

  // Session configuration
  const [interviewConfig, setInterviewConfig] = useState({
    domain: null,
    difficulty: null,
    interviewer: null
  });

  // Results State
  const [sessionResults, setSessionResults] = useState(null);

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    
    // Auto populate basic user info if available
    setProfile(prev => ({
      ...prev,
      name: userData.name || prev.name,
      email: userData.email
    }));

    if (userData.isNewUser) {
      setIsProfileOpen(true);
    }
    
    // Direct navigate to dashboard
    setCurrentPage('dashboard');
  };

  const handleProfileSave = (updatedProfile) => {
    setProfile(updatedProfile);
    // Alert or confirmation
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLaunchInterview = (configs) => {
    setInterviewConfig(prev => ({
      ...prev,
      domain: configs.domain,
      difficulty: configs.difficulty
    }));
    setCurrentPage('selector');
  };

  const handleInterviewerSelect = (interviewer) => {
    setInterviewConfig(prev => ({
      ...prev,
      interviewer
    }));
    setCurrentPage('room');
  };

  const handleInterviewEnd = (results) => {
    setSessionResults(results);
    setCurrentPage('results');
  };

  const handleRestart = () => {
    setSessionResults(null);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  return (
    <div className="app-container">
      {/* Background orbs */}
      <div className="cosmic-bg">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* Global Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => setCurrentPage(user ? 'dashboard' : 'landing')}>
          <span>⚡</span> ElevateAI
        </div>

        <div className="nav-controls">
          {/* Theme toggler */}
          <button 
            className="icon-button" 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Specific details */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                className="glass-button secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => setIsProfileOpen(true)}
              >
                👤 Profile Setup
              </button>
              
              <button 
                className="glass-button secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          ) : (
            <button 
              className="glass-button" 
              style={{ padding: '8px 20px', fontSize: '0.875rem' }}
              onClick={() => setIsAuthOpen(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Primary View Routing Router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage === 'landing' && (
          <LandingPage 
            onGetStarted={handleGetStarted} 
            onLoginClick={() => setIsAuthOpen(true)} 
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard 
            userProfile={profile} 
            onEditProfile={() => setIsProfileOpen(true)} 
            onLaunchInterview={handleLaunchInterview} 
          />
        )}

        {currentPage === 'selector' && (
          <InterviewerSelector 
            onSelect={handleInterviewerSelect} 
            onBack={() => setCurrentPage('dashboard')} 
          />
        )}

        {currentPage === 'room' && (
          <InterviewRoom 
            config={interviewConfig} 
            userProfile={profile} 
            onInterviewEnd={handleInterviewEnd} 
          />
        )}

        {currentPage === 'results' && (
          <ResultsDashboard 
            results={sessionResults} 
            onRestart={handleRestart} 
            onViewCareerCoach={() => setCurrentPage('coach')} 
          />
        )}

        {currentPage === 'coach' && (
          <CareerCoach 
            results={sessionResults} 
            userProfile={profile} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="footer">
        <p>© 2026 ElevateAI Corporation. Silicon Valley, California. Built for high-readiness global placements.</p>
      </footer>

      {/* Modals Injections */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onProfileSave={handleProfileSave} 
        initialData={profile} 
      />
    </div>
  );
}
