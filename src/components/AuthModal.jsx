import React, { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot' | 'otp'
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Focus transition helper for OTP inputs
  useEffect(() => {
    if (view === 'otp') {
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();

      setOtpTimer(60);
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [view]);

  if (!isOpen) return null;

  const handleSocialLogin = (platform) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        name: platform === 'Google' ? 'Alex Rivera' : 'Sarah Jenkins',
        email: platform === 'Google' ? 'alex.rivera@gmail.com' : 'sarah.jenkins@linkedin.com',
        avatar: platform,
        isNewUser: false
      });
      onClose();
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (view === 'login') {
        // Log in simulation
        if (!password || (authMethod === 'email' ? !email : !phone)) {
          setError('Please fill in all fields.');
          return;
        }
        onAuthSuccess({
          name: authMethod === 'email' ? email.split('@')[0] : 'User_' + phone.slice(-4),
          email: authMethod === 'email' ? email : `${phone}@elevate.ai`,
          isNewUser: false
        });
        onClose();
      } else if (view === 'signup') {
        // Sign up simulation -> Go to OTP validation
        if (!fullName || !password || (authMethod === 'email' ? !email : !phone)) {
          setError('Please fill in all fields.');
          return;
        }
        setView('otp');
      } else if (view === 'forgot') {
        // Forgot password simulation -> Notify and go back
        alert(`Password reset link sent to ${email || phone}`);
        setView('login');
      }
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    // Shift focus forward
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Shift focus backward
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otpValues];
        newOtp[index - 1] = '';
        setOtpValues(newOtp);
      }
    }
  };

  const verifyOtp = () => {
    const code = otpValues.join('');
    if (code.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        name: fullName,
        email: authMethod === 'email' ? email : `${phone}@elevate.ai`,
        phone: authMethod === 'phone' ? phone : '',
        isNewUser: true // This will trigger Profile Setup!
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px', borderTop: '4px solid var(--primary)' }}
      >
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {view !== 'otp' && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              {view === 'login' && 'Welcome Back'}
              {view === 'signup' && 'Create Account'}
              {view === 'forgot' && 'Reset Password'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {view === 'login' && 'Log in to continue your placement preparation.'}
              {view === 'signup' && 'Join the world-class AI interview workspace.'}
              {view === 'forgot' && 'Enter details to receive recovery credentials.'}
            </p>
          </div>
        )}

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error)', 
            color: '#f87171', 
            padding: '10px', 
            borderRadius: '8px', 
            fontSize: '0.875rem', 
            marginBottom: '16px',
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        {view === 'otp' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✉️</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Verify Your Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
              We sent a 6-digit OTP code to {authMethod === 'email' ? <strong>{email}</strong> : <strong>{phone}</strong>}
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  style={{
                    width: '45px',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            <button 
              className="glass-button" 
              style={{ width: '100%', marginBottom: '16px' }}
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {otpTimer > 0 ? (
                <span>Resend code in <strong>{otpTimer}s</strong></span>
              ) : (
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan-light)', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => {
                    setOtpTimer(60);
                    setView('otp');
                    setError('');
                  }}
                >
                  Resend Verification OTP
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {view === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-muted)' }}>Full Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Toggle Phone/Email */}
            {view !== 'forgot' && (
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  style={{
                    flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600',
                    background: authMethod === 'email' ? 'var(--primary)' : 'transparent',
                    color: authMethod === 'email' ? '#fff' : 'var(--text-muted)'
                  }}
                  onClick={() => setAuthMethod('email')}
                >
                  Email Address
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600',
                    background: authMethod === 'phone' ? 'var(--primary)' : 'transparent',
                    color: authMethod === 'phone' ? '#fff' : 'var(--text-muted)'
                  }}
                  onClick={() => setAuthMethod('phone')}
                >
                  Mobile Number
                </button>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-muted)' }}>
                {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              {authMethod === 'email' ? (
                <input 
                  type="email" 
                  className="glass-input" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              ) : (
                <input 
                  type="tel" 
                  className="glass-input" 
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              )}
            </div>

            {view !== 'forgot' && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Password</label>
                  {view === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setView('forgot')} 
                      style={{ background: 'none', border: 'none', color: 'var(--accent-cyan-light)', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  className="glass-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button 
              type="submit" 
              className="glass-button" 
              style={{ width: '100%', marginBottom: '20px' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (
                view === 'login' ? 'Login Securely' :
                view === 'signup' ? 'Send OTP Verification' : 'Reset Password'
              )}
            </button>

            {/* Social Authentication Splitter */}
            {view !== 'forgot' && (
              <div style={{ position: 'relative', textAlign: 'center', margin: '24px 0' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)', zIndex: 1 }}></div>
                <span style={{ position: 'relative', zIndex: 2, background: 'var(--bg-dark)', padding: '0 12px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or Continue With</span>
              </div>
            )}

            {view !== 'forgot' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <button
                  type="button"
                  className="glass-button secondary"
                  style={{ gap: '8px', padding: '10px' }}
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.76 14.93 1 12 1 7.37 1 3.4 3.65 1.54 7.5l3.78 2.93c.89-2.67 3.41-4.39 6.68-4.39z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"/>
                    <path fill="#FBBC05" d="M5.32 10.43c-.23-.68-.36-1.41-.36-2.16s.13-1.48.36-2.16L1.54 3.18C.55 5.16 0 7.37 0 9.77s.55 4.61 1.54 6.59l3.78-2.93z"/>
                    <path fill="#34A853" d="M12 18.5c2.97 0 5.46-.98 7.28-2.66l-3.73-2.89c-1 .67-2.28 1.07-3.55 1.07-3.27 0-5.79-1.72-6.68-4.39L1.54 12.56C3.4 16.4 7.37 19 12 19z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="glass-button secondary"
                  style={{ gap: '8px', padding: '10px' }}
                  onClick={() => handleSocialLogin('LinkedIn')}
                  disabled={loading}
                >
                  <svg width="18" height="18" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
              {view === 'login' ? (
                <span style={{ color: 'var(--text-muted)' }}>
                  New to ElevateAI?{' '}
                  <button 
                    type="button" 
                    onClick={() => setView('signup')} 
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Create account
                  </button>
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setView('login')} 
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
