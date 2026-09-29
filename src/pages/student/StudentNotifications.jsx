import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const list = await api.notifications.getStudentNotifications();
    setNotifications(list);
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
    const updated = await api.notifications.markStudentNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = await api.notifications.markAllStudentRead();
    setNotifications(updated);
  };

  const filtered = filter === 'Unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Notification Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Academic circulars, internal mark releases, and examination schedules
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleMarkAllRead}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {['All', 'Unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: filter === tab ? 'var(--primary)' : 'var(--bg-surface)',
              color: filter === tab ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
              transition: 'var(--transition)'
            }}
          >
            {tab} {tab === 'Unread' && `(${notifications.filter(n => !n.read).length})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No {filter.toLowerCase()} notifications found</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                backgroundColor: item.read ? 'var(--bg-surface)' : 'rgba(37, 99, 235, 0.04)',
                borderLeft: item.read ? '1px solid var(--border-light)' : '4px solid var(--primary)',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: item.read ? 600 : 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  {!item.read && (
                    <Badge variant="primary" size="sm">New</Badge>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.5rem' }}>
                  {item.message}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} /> {item.date}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                {item.link && (
                  <button
                    onClick={() => {
                      handleMarkAsRead(item.id);
                      navigate(item.link);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                  >
                    View <ExternalLink size={12} />
                  </button>
                )}
                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 600, padding: '0.2rem' }}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
