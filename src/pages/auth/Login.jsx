import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  User,
  Phone,
  Building,
  Calendar,
  BookOpen,
  Award,
  Clock,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';

export const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('student'); // 'student' | 'teacher'

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Form State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science',
    // Student specific
    studentId: '',
    year: '1',
    semester: '1',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    guardianName: '',
    guardianPhone: '',
    // Teacher specific
    teacherId: '',
    subject: 'Computer Science',
    qualification: 'M.Tech',
    experience: '3'
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login, demoLogin, register } = useAuth();
  const navigate = useNavigate();

  // Color Definitions
  const isStudent = role === 'student';
  const themeColors = isStudent
    ? {
        primary: '#2563EB',
        secondary: '#06B6D4',
        accent: '#38BDF8',
        lightBg: 'rgba(37, 99, 235, 0.08)',
        border: 'rgba(37, 99, 235, 0.25)',
        hoverBorder: 'rgba(37, 99, 235, 0.5)',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
        glow: '0 8px 24px rgba(37, 99, 235, 0.25)'
      }
    : {
        primary: '#7C3AED',
        secondary: '#8B5CF6',
        accent: '#C084FC',
        lightBg: 'rgba(124, 58, 237, 0.08)',
        border: 'rgba(124, 58, 237, 0.25)',
        hoverBorder: 'rgba(124, 58, 237, 0.5)',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
        glow: '0 8px 24px rgba(124, 58, 237, 0.25)'
      };

  useEffect(() => {
    const expiredMsg = sessionStorage.getItem('sms_auth_error');
    if (expiredMsg) {
      setError(expiredMsg);
      sessionStorage.removeItem('sms_auth_error');
    }
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setSuccessMsg('');
  };

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegData((prev) => ({ ...prev, [name]: value }));
  };

  // Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password, role);
      if (result.success) {
        setSuccessMsg('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate(`/${result.role || role}/dashboard`);
        }, 600);
      } else {
        setError(result.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Registration Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Frontend Validations
    if (!regData.name.trim() || !regData.email.trim() || !regData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (role === 'student' && !regData.studentId.trim()) {
      setError('Please provide a Student ID (e.g. STU002).');
      return;
    }

    if (role === 'teacher' && !regData.teacherId.trim()) {
      setError('Please provide a Teacher ID (e.g. TEA002).');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(regData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (regData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: regData.name.trim(),
        email: regData.email.trim().toLowerCase(),
        password: regData.password,
        confirmPassword: regData.confirmPassword,
        phone: regData.phone.trim(),
        role: role,
        department: regData.department
      };

      if (role === 'student') {
        payload.studentId = regData.studentId.trim();
        payload.year = regData.year;
        payload.semester = regData.semester;
        payload.dateOfBirth = regData.dateOfBirth;
        payload.gender = regData.gender;
        payload.address = regData.address;
        payload.guardianName = regData.guardianName;
        payload.guardianPhone = regData.guardianPhone;
      } else {
        payload.teacherId = regData.teacherId.trim();
        payload.subject = regData.subject;
        payload.qualification = regData.qualification;
        payload.experience = regData.experience;
      }

      const res = await register(payload);
      if (res.success) {
        setSuccessMsg('Account created successfully! You can now login.');
        // Pre-fill email in login form
        setEmail(regData.email.trim());
        setPassword('');
        // Smoothly transition to login view after short delay
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('Account created successfully! Please sign in with your credentials.');
        }, 1200);
      } else {
        setError(res.message || 'Registration failed. Please review your details.');
      }
    } catch (err) {
      setError('Failed to connect to registration server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Instant Demo Login
  const handleQuickDemoLogin = async (selectedRole) => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    const res = await demoLogin(selectedRole);
    setIsLoading(false);
    if (res.success) {
      navigate(`/${selectedRole}/dashboard`);
    } else {
      setError(res.message || 'Demo login failed');
    }
  };

  // Autofill Demo Credentials
  const fillDemoCredentials = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setEmail('student@demo.com');
      setPassword('student123');
    } else {
      setEmail('teacher@demo.com');
      setPassword('teacher123');
    }
    setError('');
  };

  // Forgot Password handler
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setIsForgotModalOpen(false);
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#070d19',
        padding: '2rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Dynamic Background Glowing Gradients */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: isStudent ? '-10%' : '60%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: isStudent
            ? 'radial-gradient(circle, rgba(37, 99, 235, 0.16) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 70%)',
          filter: 'blur(60px)',
          transition: 'all 0.8s ease',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: isStudent ? '-10%' : '60%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: isStudent
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(37, 99, 235, 0.03) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(192, 132, 252, 0.12) 0%, rgba(124, 58, 237, 0.03) 50%, transparent 70%)',
          filter: 'blur(60px)',
          transition: 'all 0.8s ease',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Floating Education Symbols Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1,
          opacity: 0.18
        }}
      >
        <div style={{ position: 'absolute', top: '12%', left: '8%', fontSize: '1.75rem', animation: 'smsFloatSlow 6s ease-in-out infinite' }}>
          {isStudent ? '🎓' : '👨‍🏫'}
        </div>
        <div style={{ position: 'absolute', top: '22%', right: '12%', fontSize: '1.6rem', animation: 'smsFloatSlowAlt 7s ease-in-out infinite' }}>
          📚
        </div>
        <div style={{ position: 'absolute', bottom: '20%', left: '10%', fontSize: '1.5rem', animation: 'smsFloatSlowAlt 8s ease-in-out infinite' }}>
          {isStudent ? '✏️' : '📝'}
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: '1.65rem', animation: 'smsFloatSlow 6.5s ease-in-out infinite' }}>
          {isStudent ? '📖' : '🎓'}
        </div>
        <div style={{ position: 'absolute', top: '48%', left: '4%', fontSize: '1.35rem', animation: 'smsFloatSlow 9s ease-in-out infinite' }}>
          ⭐
        </div>
        <div style={{ position: 'absolute', top: '55%', right: '5%', fontSize: '1.35rem', animation: 'smsFloatSlowAlt 8.5s ease-in-out infinite' }}>
          ⭐
        </div>
      </div>

      {/* Main Authentication Container */}
      <div
        className="sms-auth-card"
        style={{
          width: '100%',
          maxWidth: mode === 'register' ? '680px' : '480px',
          position: 'relative',
          zIndex: 2,
          transition: 'max-width 0.4s ease'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: themeColors.gradient,
              color: 'white',
              boxShadow: themeColors.glow,
              marginBottom: '1rem',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {isStudent ? <GraduationCap size={36} /> : <ShieldCheck size={36} />}
          </div>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.025em',
              marginBottom: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            EduPulse Portal
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Apex Institute Student & Faculty Management System
          </p>
        </div>

        {/* Card Body */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '20px',
            padding: mode === 'register' ? '2.25rem 2rem' : '2rem',
            border: `1px solid ${themeColors.border}`,
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 25px rgba(15, 23, 42, 0.6)',
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
          }}
        >
          {/* Header Switch for Mode */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #1e293b',
              paddingBottom: '0.85rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                {mode === 'login' ? `${isStudent ? 'Student' : 'Faculty'} Portal Login` : 'Create Your Account'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                {mode === 'login'
                  ? 'Access your courses, attendance, grades, and schedules'
                  : 'Register a new institutional profile in Apex Institute SMS'}
              </p>
            </div>
            {mode === 'register' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMsg('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.825rem',
                  color: themeColors.accent,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: '0.4rem 0.65rem',
                  borderRadius: '8px'
                }}
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            )}
          </div>

          {/* Role Selection Tabs / Animated Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}
          >
            {/* Student Role Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                border: isStudent ? '2px solid #2563eb' : '1px solid #1e293b',
                backgroundColor: isStudent ? 'rgba(37, 99, 235, 0.15)' : '#131c31',
                color: isStudent ? '#38bdf8' : '#94a3b8',
                boxShadow: isStudent ? '0 4px 15px rgba(37, 99, 235, 0.2)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>🎓</span>
              <span>Student {mode === 'login' ? 'Login' : 'Account'}</span>
            </button>

            {/* Teacher Role Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                border: !isStudent ? '2px solid #7c3aed' : '1px solid #1e293b',
                backgroundColor: !isStudent ? 'rgba(124, 58, 237, 0.15)' : '#131c31',
                color: !isStudent ? '#c084fc' : '#94a3b8',
                boxShadow: !isStudent ? '0 4px 15px rgba(124, 58, 237, 0.2)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>👨‍🏫</span>
              <span>Teacher {mode === 'login' ? 'Login' : 'Account'}</span>
            </button>
          </div>

          {/* Feedback: Error Alert with Shake Animation */}
          {error && (
            <div
              className="sms-shake"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                lineHeight: 1.4
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Feedback: Success Alert with Pop-in Animation */}
          {successMsg && (
            <div
              className="sms-success-pop"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                color: '#86efac',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#22c55e' }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* -------------------- MODE 1: LOGIN FORM -------------------- */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label
                  htmlFor="login-email"
                  style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}
                >
                  Email or Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isStudent ? '#38bdf8' : '#c084fc',
                      display: 'flex'
                    }}
                  >
                    <Mail size={18} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isStudent ? 'student@demo.com' : 'teacher@demo.com'}
                    style={{
                      width: '100%',
                      backgroundColor: '#131c31',
                      border: '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.6rem',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = themeColors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${isStudent ? 'rgba(37, 99, 235, 0.2)' : 'rgba(124, 58, 237, 0.2)'}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label
                    htmlFor="login-password"
                    style={{ fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1' }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    style={{
                      fontSize: '0.775rem',
                      color: themeColors.accent,
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isStudent ? '#38bdf8' : '#c084fc',
                      display: 'flex'
                    }}
                  >
                    <Lock size={18} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      backgroundColor: '#131c31',
                      border: '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = themeColors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${isStudent ? 'rgba(37, 99, 235, 0.2)' : 'rgba(124, 58, 237, 0.2)'}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember this device */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    color: '#94a3b8'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: themeColors.primary, cursor: 'pointer' }}
                  />
                  Remember this device
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  background: themeColors.gradient,
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: themeColors.glow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.75 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <span className="sms-spinner" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {isStudent ? 'Student' : 'Faculty'} Portal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* CREATE ACCOUNT LINK SECTION */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  marginTop: '0.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  border: '1px dashed #1e293b'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: themeColors.accent,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Create an Account
                </button>
              </div>

              {/* Instant Demo Access Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '0.5rem 0',
                  color: '#64748b',
                  fontSize: '0.725rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }} />
                <span style={{ padding: '0 0.75rem', fontWeight: 700 }}>Instant Demo Access</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }} />
              </div>

              {/* Quick Demo Login Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    color: '#38bdf8',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.16)';
                    e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} />
                    <span>Student Demo Login</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85, fontFamily: 'var(--font-mono)' }}>student@demo.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('teacher')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(124, 58, 237, 0.08)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    color: '#c084fc',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.16)';
                    e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} />
                    <span>Teacher Demo Login</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85, fontFamily: 'var(--font-mono)' }}>teacher@demo.com</span>
                </button>
              </div>

              {/* Demo Credentials Box */}
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: '#131c31',
                  border: '1px solid #1e293b',
                  fontSize: '0.775rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  <Info size={14} color={themeColors.accent} /> Demo Credentials Reference:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>• <strong>Student:</strong> <code style={{ color: '#38bdf8' }}>student@demo.com</code> / <code style={{ color: '#38bdf8' }}>student123</code></span>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('student')}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.725rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Autofill
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>• <strong>Teacher:</strong> <code style={{ color: '#c084fc' }}>teacher@demo.com</code> / <code style={{ color: '#c084fc' }}>teacher123</code></span>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('teacher')}
                      style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: '0.725rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Autofill
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* -------------------- MODE 2: REGISTRATION FORM -------------------- */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Primary Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {/* Full Name */}
                <div>
                  <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                      <User size={16} />
                    </span>
                    <input
                      id="reg-name"
                      name="name"
                      type="text"
                      value={regData.name}
                      onChange={handleRegChange}
                      placeholder={isStudent ? 'e.g. Alex Johnson' : 'e.g. Dr. Robert Vance'}
                      style={{
                        width: '100%',
                        backgroundColor: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '0.7rem 1rem 0.7rem 2.4rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Role-Specific ID: Student ID or Teacher ID */}
                <div>
                  <label htmlFor="reg-id" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    {isStudent ? 'Student ID *' : 'Teacher ID *'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                      <Award size={16} />
                    </span>
                    <input
                      id="reg-id"
                      name={isStudent ? 'studentId' : 'teacherId'}
                      type="text"
                      value={isStudent ? regData.studentId : regData.teacherId}
                      onChange={handleRegChange}
                      placeholder={isStudent ? 'e.g. STU002' : 'e.g. TEA002'}
                      style={{
                        width: '100%',
                        backgroundColor: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '0.7rem 1rem 0.7rem 2.4rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Institutional Email *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                      <Mail size={16} />
                    </span>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      value={regData.email}
                      onChange={handleRegChange}
                      placeholder={isStudent ? 'student@apex.edu' : 'faculty@apex.edu'}
                      style={{
                        width: '100%',
                        backgroundColor: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '0.7rem 1rem 0.7rem 2.4rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="reg-phone" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Phone Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                      <Phone size={16} />
                    </span>
                    <input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      value={regData.phone}
                      onChange={handleRegChange}
                      placeholder="e.g. 9876543210"
                      style={{
                        width: '100%',
                        backgroundColor: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '0.7rem 1rem 0.7rem 2.4rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Password (min. 6 characters) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                      <Lock size={16} />
                    </span>
                    <input
                      id="reg-password"
                      name="password"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regData.password}
                      onChange={handleRegChange}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        backgroundColor: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '0.7rem 2.4rem 0.7rem 2.4rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                      {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reg-confirm-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Confirm Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                      <Lock size={16} />
                    </span>
                    <input
                      id="reg-confirm-password"
                      name="confirmPassword"
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regData.confirmPassword}
                      onChange={handleRegChange}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        backgroundColor: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '0.7rem 2.4rem 0.7rem 2.4rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                      {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Department (Common to both) */}
                <div>
                  <label htmlFor="reg-dept" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Department *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                      <Building size={16} />
                    </span>
                    <select
                      id="reg-dept"
                      name="department"
                      value={regData.department}
                      onChange={handleRegChange}
                      style={{
                        width: '100%',
                        backgroundColor: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '0.7rem 1rem 0.7rem 2.4rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      required
                    >
                      <option value="Computer Science">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                  </div>
                </div>

                {/* Student specific: Year & Semester */}
                {isStudent && (
                  <>
                    <div>
                      <label htmlFor="reg-year" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                        Academic Year *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                          <Calendar size={16} />
                        </span>
                        <select
                          id="reg-year"
                          name="year"
                          value={regData.year}
                          onChange={handleRegChange}
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '10px',
                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                            color: '#f8fafc',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                          required
                        >
                          <option value="1">1st Year (Freshman)</option>
                          <option value="2">2nd Year (Sophomore)</option>
                          <option value="3">3rd Year (Junior)</option>
                          <option value="4">4th Year (Senior)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-semester" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                        Semester *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                          <BookOpen size={16} />
                        </span>
                        <select
                          id="reg-semester"
                          name="semester"
                          value={regData.semester}
                          onChange={handleRegChange}
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '10px',
                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                            color: '#f8fafc',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                          required
                        >
                          <option value="1">Semester 1</option>
                          <option value="2">Semester 2</option>
                          <option value="3">Semester 3</option>
                          <option value="4">Semester 4</option>
                          <option value="5">Semester 5</option>
                          <option value="6">Semester 6</option>
                          <option value="7">Semester 7</option>
                          <option value="8">Semester 8</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Teacher specific: Subject, Qualification & Experience */}
                {!isStudent && (
                  <>
                    <div>
                      <label htmlFor="reg-subject" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                        Primary Subject *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                          <BookOpen size={16} />
                        </span>
                        <input
                          id="reg-subject"
                          name="subject"
                          type="text"
                          value={regData.subject}
                          onChange={handleRegChange}
                          placeholder="e.g. Database Management Systems"
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '10px',
                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                            color: '#f8fafc',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-qualification" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                        Qualification *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                          <Award size={16} />
                        </span>
                        <input
                          id="reg-qualification"
                          name="qualification"
                          type="text"
                          value={regData.qualification}
                          onChange={handleRegChange}
                          placeholder="e.g. Ph.D. / M.Tech / M.Sc"
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '10px',
                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                            color: '#f8fafc',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-experience" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                        Teaching Experience (Years) *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: themeColors.accent }}>
                          <Clock size={16} />
                        </span>
                        <input
                          id="reg-experience"
                          name="experience"
                          type="number"
                          min="0"
                          max="40"
                          value={regData.experience}
                          onChange={handleRegChange}
                          placeholder="e.g. 5"
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '10px',
                            padding: '0.7rem 1rem 0.7rem 2.4rem',
                            color: '#f8fafc',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Student Optional Fields Accordion */}
              {isStudent && (
                <div style={{ border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#131c31',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Additional Profile Details (Optional)</span>
                    {showOptionalFields ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {showOptionalFields && (
                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '0.85rem'
                      }}
                    >
                      <div>
                        <label htmlFor="reg-dob" style={{ display: 'block', fontSize: '0.775rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                          Date of Birth
                        </label>
                        <input
                          id="reg-dob"
                          name="dateOfBirth"
                          type="date"
                          value={regData.dateOfBirth}
                          onChange={handleRegChange}
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '8px',
                            padding: '0.6rem 0.75rem',
                            color: '#f8fafc',
                            fontSize: '0.825rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-gender" style={{ display: 'block', fontSize: '0.775rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                          Gender
                        </label>
                        <select
                          id="reg-gender"
                          name="gender"
                          value={regData.gender}
                          onChange={handleRegChange}
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '8px',
                            padding: '0.6rem 0.75rem',
                            color: '#f8fafc',
                            fontSize: '0.825rem',
                            outline: 'none'
                          }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="reg-address" style={{ display: 'block', fontSize: '0.775rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                          Permanent Address
                        </label>
                        <input
                          id="reg-address"
                          name="address"
                          type="text"
                          value={regData.address}
                          onChange={handleRegChange}
                          placeholder="e.g. 104 Campus Avenue, North Campus"
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '8px',
                            padding: '0.6rem 0.75rem',
                            color: '#f8fafc',
                            fontSize: '0.825rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-guardian-name" style={{ display: 'block', fontSize: '0.775rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                          Guardian Name
                        </label>
                        <input
                          id="reg-guardian-name"
                          name="guardianName"
                          type="text"
                          value={regData.guardianName}
                          onChange={handleRegChange}
                          placeholder="e.g. Robert Johnson"
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '8px',
                            padding: '0.6rem 0.75rem',
                            color: '#f8fafc',
                            fontSize: '0.825rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="reg-guardian-phone" style={{ display: 'block', fontSize: '0.775rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                          Guardian Phone
                        </label>
                        <input
                          id="reg-guardian-phone"
                          name="guardianPhone"
                          type="tel"
                          value={regData.guardianPhone}
                          onChange={handleRegChange}
                          placeholder="e.g. 9876543211"
                          style={{
                            width: '100%',
                            backgroundColor: '#131c31',
                            border: '1px solid #1e293b',
                            borderRadius: '8px',
                            padding: '0.6rem 0.75rem',
                            color: '#f8fafc',
                            fontSize: '0.825rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  background: themeColors.gradient,
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: themeColors.glow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.75 : 1,
                  marginTop: '0.5rem'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="sms-spinner" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create {isStudent ? 'Student' : 'Teacher'} Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: themeColors.accent,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem' }}>
          EduPulse SMS v1.0 • Apex Institute of Engineering & Technology
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setForgotSuccess(false);
        }}
        title="Password Recovery Notice"
      >
        {forgotSuccess ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}
            >
              <CheckCircle2 size={26} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#f8fafc' }}>
              Notice Acknowledged
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Password reset functionality will be available soon in the upcoming institutional update. For immediate demo testing, please use the provided demo accounts: <code style={{ color: '#38bdf8' }}>student123</code> or <code style={{ color: '#c084fc' }}>teacher123</code>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Enter your registered institute email address below.
            </p>
            <div>
              <label htmlFor="modal-forgot-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Institute Email
              </label>
              <input
                id="modal-forgot-email"
                type="email"
                placeholder="you@apex.edu"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#131c31',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>
            <div
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                fontSize: '0.775rem',
                color: '#fcd34d'
              }}
            >
              <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              <strong>Note:</strong> Automated password reset functionality will be available soon. Please contact system admin or use default demo credentials for current testing.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ background: themeColors.gradient }}>
                Submit Request
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
