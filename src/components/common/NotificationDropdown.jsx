import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, [role]);

  const loadNotifications = async () => {
    if (role === 'student') {
      const list = await api.notifications.getStudentNotifications();
      setNotifications(list);
    } else {
      const list = await api.notifications.getTeacherNotifications();
      setNotifications(list);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (role === 'student') {
      const updated = await api.notifications.markAllStudentRead();
      setNotifications(updated);
    } else {
      const updated = await api.notifications.markAllTeacherRead();
      setNotifications(updated);
    }
  };

  const handleItemClick = async (notif) => {
    if (role === 'student') {
      await api.notifications.markStudentNotificationRead(notif.id);
    } else {
      await api.notifications.markTeacherNotificationRead(notif.id);
    }
    loadNotifications();
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-hover)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition)'
        }}
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            backgroundColor: 'var(--danger)',
            color: 'white',
            fontSize: '0.68rem',
            fontWeight: 700,
            width: '18px',
            height: '18px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 2px var(--bg-surface)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: '340px',
            maxWidth: '90vw',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{
            padding: '0.875rem 1rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>Notifications</span>
              {unreadCount > 0 && (
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    backgroundColor: n.read ? 'transparent' : 'var(--primary-light)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: n.read ? 600 : 700, color: 'var(--text-primary)' }}>
                      {n.title}
                    </span>
                    {!n.read && (
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {n.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    <Clock size={12} /> {n.date}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{
            padding: '0.625rem 1rem',
            borderTop: '1px solid var(--border-light)',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface-hover)'
          }}>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate(`/${role}/notifications`);
              }}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              View all notifications <ExternalLink size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
