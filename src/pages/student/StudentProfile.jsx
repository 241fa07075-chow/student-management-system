import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Edit3,
  CheckCircle2,
  Shield,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';

export const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    guardianName: user?.guardianName || '',
    guardianPhone: user?.guardianPhone || ''
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
      
      {/* Header Profile Hero Card */}
      <div className="card" style={{
        padding: '2rem',
        background: 'linear-gradient(to right, var(--bg-surface), var(--bg-surface-hover))',
        position: 'relative',
        overflow: 'hidden'
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
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                alt={user?.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  border: '4px solid var(--primary)',
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
                <span className="badge badge-primary">{user?.rollNo || '21CS042'}</span>
                <span className="badge badge-success">Active Enrolled</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.925rem' }}>
                {user?.department} • {user?.year} ({user?.semester})
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Student ID: <strong style={{ color: 'var(--text-primary)' }}>{user?.id}</strong></span>
                <span>Academic Year: <strong style={{ color: 'var(--text-primary)' }}>{user?.academicYear || '2025-2026'}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setFormData({
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || '',
                address: user?.address || '',
                guardianName: user?.guardianName || '',
                guardianPhone: user?.guardianPhone || ''
              });
              setIsEditOpen(true);
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid-2">
        
        {/* Academic Profile Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BookOpen size={18} color="var(--primary)" /> Academic Details
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Department</span>
              <strong style={{ fontSize: '0.875rem' }}>{user?.department}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Current Year & Semester</span>
              <strong style={{ fontSize: '0.875rem' }}>{user?.year}, {user?.semester}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Roll Number</span>
              <strong style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>{user?.rollNo}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Admission / Enrolled Date</span>
              <strong style={{ fontSize: '0.875rem' }}>{user?.enrollmentDate || 'August 2023'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Current CGPA</span>
              <strong style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>8.52 / 10.0</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Registered Credits</span>
              <strong style={{ fontSize: '0.875rem' }}>24 Credits (6 Courses)</strong>
            </div>
          </div>
        </div>

        {/* Contact & Personal Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <User size={18} color="var(--purple)" /> Personal & Contact Information
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Mail size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Official College Email</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Phone size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Mobile Number</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Calendar size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Date of Birth & Blood Group</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.dob || '15 Aug 2004'} • Blood Group: {user?.bloodGroup || 'O+'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '3px' }} />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Permanent Residential Address</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{user?.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Emergency / Guardian Contact</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.guardianName || 'Rajesh Sharma'} ({user?.guardianPhone || '+91 98765 12345'})</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student Profile">
        {saveSuccess ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={42} color="var(--success)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Profile Updated!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Changes have been saved to frontend state.</p>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Permanent Address</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Guardian Name</label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Guardian Phone</label>
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
