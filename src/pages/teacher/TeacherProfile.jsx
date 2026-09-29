import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Briefcase,
  MapPin,
  Clock,
  Edit3,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';

export const TeacherProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    department: user?.department || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    cabin: user?.cabin || '',
    officeHours: user?.officeHours || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditOpen(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Teacher Profile Hero */}
      <div className="card" style={{
        padding: '2rem',
        background: 'linear-gradient(to right, var(--bg-surface), var(--bg-surface-hover))',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"}
                alt={user?.name}
                style={{
                  width: '105px',
                  height: '105px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  border: '4px solid var(--purple)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                border: '3px solid var(--bg-surface)'
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user?.name}</h1>
                <span className="badge badge-purple">{user?.id || 'EMP-2018-042'}</span>
                <span className="badge badge-success">Faculty Full-time</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.925rem' }}>
                {user?.designation} • {user?.department}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Cabin: <strong style={{ color: 'var(--text-primary)' }}>{user?.cabin || 'Block C, Room 304'}</strong></span>
                <span>Experience: <strong style={{ color: 'var(--text-primary)' }}>{user?.experience || '12 Years'}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setFormData({
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || '',
                department: user?.department || '',
                specialization: user?.specialization || '',
                experience: user?.experience || '',
                cabin: user?.cabin || '',
                officeHours: user?.officeHours || ''
              });
              setIsEditOpen(true);
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Edit3 size={16} /> Edit Faculty Profile
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid-2">
        
        {/* Academic & Professional Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Briefcase size={18} color="var(--purple)" /> Academic & Faculty Credentials
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Employee ID</span>
              <strong style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>{user?.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Department</span>
              <strong style={{ fontSize: '0.875rem' }}>{user?.department}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Primary Subject / Domain</span>
              <strong style={{ fontSize: '0.875rem' }}>Database Management & Distributed Systems</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Academic Qualifications</span>
              <strong style={{ fontSize: '0.875rem' }}>{user?.qualification || 'Ph.D. Computer Science (IITB)'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Research & Specialization</span>
              <strong style={{ fontSize: '0.875rem', textAlign: 'right', maxWidth: '240px' }}>{user?.specialization}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Teaching Experience</span>
              <strong style={{ fontSize: '0.875rem', color: 'var(--purple)' }}>{user?.experience}</strong>
            </div>
          </div>
        </div>

        {/* Contact & Office Consultation Hours */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={18} color="var(--primary)" /> Office & Contact Details
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Mail size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Official University Email</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Phone size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Contact Extension / Mobile</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '3px' }} />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Faculty Cabin / Lab Location</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.cabin}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Clock size={16} color="var(--text-muted)" style={{ marginTop: '3px' }} />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Student Mentorship Office Hours</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{user?.officeHours}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Teacher Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Faculty Profile">
        {saveSuccess ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={42} color="var(--success)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Faculty Profile Updated!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Changes have been saved to local state.</p>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Full Name & Honorific</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Contact Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Faculty Cabin / Office</label>
                <input
                  type="text"
                  value={formData.cabin}
                  onChange={(e) => setFormData({ ...formData, cabin: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Specialization & Research</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Office Consultation Hours</label>
              <input
                type="text"
                value={formData.officeHours}
                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                Save Profile
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
