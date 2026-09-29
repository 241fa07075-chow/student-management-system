import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  Plus,
  Send,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const TeacherNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'academic'
  });
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const list = await api.notifications.getTeacherNotifications();
    setNotifications(list);
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
    const updated = await api.notifications.markTeacherNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = await api.notifications.markAllTeacherRead();
    setNotifications(updated);
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    await api.notifications.sendAnnouncement(broadcastForm);
    setIsBroadcastOpen(false);
    setBroadcastForm({ title: '', message: '', type: 'academic' });
    setToastMsg('Announcement broadcasted to student portals!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  if (loading) return <div>Loading faculty notices...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'var(--success)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Faculty Notices & Broadcasts</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Administrative alerts, evaluation tasks & direct class announcement dispatch
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Megaphone size={16} /> Broadcast Notice
          </button>
          <button
            onClick={handleMarkAllRead}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <CheckCheck size={16} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              backgroundColor: item.read ? 'var(--bg-surface)' : 'rgba(124, 58, 237, 0.04)',
              borderLeft: item.read ? '1px solid var(--border-light)' : '4px solid var(--purple)',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: item.read ? 600 : 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                {!item.read && (
                  <Badge variant="purple" size="sm">Action Required</Badge>
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
                  Open <ExternalLink size={12} />
                </button>
              )}
              {!item.read && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  style={{ fontSize: '0.725rem', color: 'var(--purple)', fontWeight: 600, padding: '0.2rem' }}
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BROADCAST ANNOUNCEMENT MODAL */}
      <Modal isOpen={isBroadcastOpen} onClose={() => setIsBroadcastOpen(false)} title="Broadcast Announcement to Students">
        <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Notice Headline</label>
            <input
              type="text"
              placeholder="e.g. Midterm Evaluation Guideline & Syllabus Scope"
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Notice Type</label>
            <select
              value={broadcastForm.type}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
            >
              <option value="academic">Academic Assessment</option>
              <option value="urgent">Urgent Deadline / Alert</option>
              <option value="general">General Department Circular</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Detailed Message</label>
            <textarea
              rows={4}
              placeholder="Write the full announcement text that will appear on student dashboards..."
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsBroadcastOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <Send size={15} /> Publish Announcement
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
