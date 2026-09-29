import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  BookOpen,
  Award,
  FileText,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Users,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
    { label: 'Courses', path: '/student/courses', icon: BookOpen },
    { label: 'Marks / Results', path: '/student/marks', icon: Award },
    { label: 'Assignments', path: '/student/assignments', icon: FileText },
    { label: 'Timetable', path: '/student/timetable', icon: Calendar },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
    { label: 'Reports', path: '/student/reports', icon: BarChart3 },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const teacherLinks = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/teacher/profile', icon: User },
    { label: 'Students', path: '/teacher/students', icon: Users },
    { label: 'Courses', path: '/teacher/courses', icon: BookOpen },
    { label: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
    { label: 'Marks', path: '/teacher/marks', icon: Award },
    { label: 'Assignments', path: '/teacher/assignments', icon: FileText },
    { label: 'Timetable', path: '/teacher/timetable', icon: Calendar },
    { label: 'Reports', path: '/teacher/reports', icon: BarChart3 },
    { label: 'Notifications', path: '/teacher/notifications', icon: Bell },
    { label: 'Settings', path: '/teacher/settings', icon: Settings },
  ];

  const links = role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
            display: 'block'
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-sidebar)',
          color: 'var(--text-sidebar)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-lg)'
        }}
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Brand / Logo */}
        <div style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)'
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                EduPulse
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Campus ERP
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="sidebar-close-btn"
            style={{
              color: '#94a3b8',
              padding: '0.25rem',
              borderRadius: '4px'
            }}
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{
          flex: 1,
          padding: '1rem 0.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748b',
            padding: '0.5rem 0.75rem 0.25rem 0.75rem'
          }}>
            Main Menu
          </div>

          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth <= 1024) onClose();
                }}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-sidebar-bright)' : 'var(--text-sidebar)',
                  backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                  transition: 'var(--transition)',
                  position: 'relative'
                })}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom */}
        <div style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.15)'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#f87171',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              transition: 'var(--transition)',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar-link:hover:not(.active) {
          background-color: var(--bg-sidebar-hover) !important;
          color: #ffffff !important;
        }
        .sidebar-close-btn {
          display: none;
        }

        @media (max-width: 1024px) {
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
          .sidebar-close-btn {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};
