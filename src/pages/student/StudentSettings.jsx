import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Lock,
  User,
  Shield,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const StudentSettings = () => {
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

  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    assignmentDeadlines: true,
    attendanceWarnings: true,
    examSchedules: true
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Account & System Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Configure theme preferences, notification triggers, and portal security
        </p>
      </div>

      {/* Theme Preferences */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            {theme === 'dark' ? <Moon size={18} color="#fbbf24" /> : <Sun size={18} color="var(--primary)" />}
            Appearance & Interface Theme
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Dark Color Theme</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Enable dark mode for high-contrast viewing and reduced eye strain
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

      {/* Notification Preferences */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Bell size={18} color="var(--primary)" /> Notification Channels & Alerts
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Announcements</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive major department and college announcements via email</div>
            </div>
            <input
              type="checkbox"
              checked={notifSettings.emailAlerts}
              onChange={(e) => setNotifSettings({ ...notifSettings, emailAlerts: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Assignment Deadlines Reminders</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify 24 hours prior to submission deadlines</div>
            </div>
            <input
              type="checkbox"
              checked={notifSettings.assignmentDeadlines}
              onChange={(e) => setNotifSettings({ ...notifSettings, assignmentDeadlines: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Attendance Shortage Warning</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant alert if attendance in any subject drops below 78%</div>
            </div>
            <input
              type="checkbox"
              checked={notifSettings.attendanceWarnings}
              onChange={(e) => setNotifSettings({ ...notifSettings, attendanceWarnings: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
          </label>
        </div>
      </div>

      {/* Password Change UI (Demo) */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Lock size={18} color="var(--purple)" /> Security & Password
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
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Current Password</label>
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
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Session / Danger Zone */}
      <div className="card" style={{ borderColor: 'var(--danger-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)' }}>Terminate Session</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sign out from this device. All local demo data will remain intact until browser storage is cleared.
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
