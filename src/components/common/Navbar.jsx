import React from 'react';
import { Menu, LogOut, Sun, Moon, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: 'var(--navbar-height)',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'var(--transition)'
    }}>
      {/* Left: Mobile hamburger & Context breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-surface-hover)'
          }}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: role === 'teacher' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(37, 99, 235, 0.12)',
            color: role === 'teacher' ? 'var(--purple)' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            {role === 'teacher' ? <Shield size={12} /> : <GraduationCap size={13} />}
            {role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
          </span>
          {role === 'student' && user?.semester && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'none', mdDisplay: 'inline' }} className="hide-on-mobile">
              • {user.semester}
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions, Theme, Notifs, Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-hover)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={19} color="#fbbf24" /> : <Moon size={19} />}
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)' }} />

        {/* User Card */}
        <div
          onClick={() => navigate(`/${role}/profile`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-md)',
            transition: 'var(--transition)'
          }}
          title="View Profile"
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name || "User Avatar"}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }} className="hide-on-mobile">
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {role === 'student' ? (user?.rollNo || 'Student') : (user?.designation || 'Faculty')}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--danger)',
            borderColor: 'var(--danger-border)'
          }}
          title="Logout"
        >
          <LogOut size={15} />
          <span className="hide-on-mobile">Logout</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
