import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Lock,
  LogOut,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const TeacherSettings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  const [notifs, setNotifs] = useState({
    submissionAlerts: true,
    attendanceAlerts: true,
    facultyMeetings: true
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassError('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long.');
      return;
    }
    setPassSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Faculty Portal Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Display theme, faculty alert dispatching & login security
        </p>
      </div>

      {/* Theme Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            {theme === 'dark' ? <Moon size={18} color="#fbbf24" /> : <Sun size={18} color="var(--purple)" />}
            Interface Appearance Theme
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Dark Color Theme</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Toggle dark mode for comfortable late-night evaluation sessions
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Bell size={18} color="var(--purple)" /> Faculty Alert Notifications
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Assignment Submission Pushes</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alert when batch student submissions reach 80% mark</div>
            </div>
            <input
              type="checkbox"
              checked={notifs.submissionAlerts}
              onChange={(e) => setNotifs({ ...notifs, submissionAlerts: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--purple)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Attendance Shortage Threshold Alerts</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify when any enrolled student drops below 75% attendance</div>
            </div>
            <input
              type="checkbox"
              checked={notifs.attendanceAlerts}
              onChange={(e) => setNotifs({ ...notifs, attendanceAlerts: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--purple)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Academic Senate & Department Meetings</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calendar synchronization for HOD and faculty meetings</div>
            </div>
            <input
              type="checkbox"
              checked={notifs.facultyMeetings}
              onChange={(e) => setNotifs({ ...notifs, facultyMeetings: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--purple)' }}
            />
          </label>
        </div>
      </div>

      {/* Password Change UI */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Lock size={18} color="var(--purple)" /> Faculty Credentials & Password
          </h3>
        </div>

        {passSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success-text)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            <CheckCircle2 size={18} />
            <span>Password updated successfully (frontend demo state).</span>
          </div>
        )}

        {passError && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger-text)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            {passError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Current Faculty Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Session Termination */}
      <div className="card" style={{ borderColor: 'var(--danger-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)' }}>Terminate Faculty Session</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sign out from this faculty terminal. Local changes remain saved in frontend browser state.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};
