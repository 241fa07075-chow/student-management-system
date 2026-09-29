import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCheck,
  Search,
  Filter,
  Eye,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAsn, setSelectedAsn] = useState(null);
  const [submitModalAsn, setSubmitModalAsn] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const list = await api.assignments.getStudentAssignments();
    setAssignments(list);
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!submitModalAsn) return;
    await api.assignments.submitStudentAssignment(submitModalAsn.id, {
      notes: submissionNotes,
      fileName: fileName || 'assignment_submission.pdf'
    });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setSubmitModalAsn(null);
      setSubmissionNotes('');
      setFileName('');
      loadAssignments();
    }, 1200);
  };

  const filtered = assignments.filter((item) => {
    if (filterStatus === 'All') return true;
    return item.status.toLowerCase() === filterStatus.toLowerCase();
  });

  if (loading) return <div>Loading course assignments...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Course Assignments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Track continuous evaluations, laboratory writeups, and homework submissions
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          {['All', 'Pending', 'Graded'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: filterStatus === status ? 'var(--primary)' : 'transparent',
                color: filterStatus === status ? 'white' : 'var(--text-secondary)',
                transition: 'var(--transition)'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              borderLeft: item.status === 'Pending' ? '4px solid var(--warning)' : '4px solid var(--success)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <code style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{item.subjectCode}</code>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {item.subject}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant={item.status === 'Pending' ? 'warning' : 'success'}>
                  {item.status}
                </Badge>
                {item.obtainedMarks !== null && (
                  <Badge variant="primary">
                    Score: {item.obtainedMarks}/{item.totalMarks}
                  </Badge>
                )}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {item.description}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: item.status === 'Pending' ? 'var(--danger-text)' : 'var(--text-muted)', fontWeight: 600 }}>
                  <Clock size={14} /> Due: {item.dueDate}
                </div>
                <span>Faculty: <strong>{item.instructor}</strong></span>
                <span>Max Marks: <strong>{item.totalMarks}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedAsn(item)}
                  className="btn btn-secondary btn-sm"
                >
                  <Eye size={14} /> Details
                </button>
                {item.status === 'Pending' && (
                  <button
                    onClick={() => {
                      setSubmitModalAsn(item);
                      setFileName('');
                      setSubmissionNotes('');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <UploadCloud size={14} /> Submit Work
                  </button>
                )}
              </div>
            </div>

            {item.feedback && (
              <div style={{
                marginTop: '0.25rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--success-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--success-text)',
                border: '1px solid var(--success-border)'
              }}>
                <strong>Professor Feedback:</strong> {item.feedback}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedAsn && (
        <Modal isOpen={!!selectedAsn} onClose={() => setSelectedAsn(null)} title={selectedAsn.title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>COURSE & CODE</span>
              <p style={{ fontWeight: 600 }}>{selectedAsn.subject} ({selectedAsn.subjectCode})</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>DEADLINE</span>
              <p style={{ fontWeight: 600, color: 'var(--danger)' }}>{selectedAsn.dueDate}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>TASK INSTRUCTIONS</span>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '0.25rem' }}>{selectedAsn.description}</p>
            </div>
            {selectedAsn.attachments && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Reference Material / Attachment:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>📎 {selectedAsn.attachments}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedAsn(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Submission Modal */}
      {submitModalAsn && (
        <Modal isOpen={!!submitModalAsn} onClose={() => setSubmitModalAsn(null)} title={`Submit: ${submitModalAsn.title}`}>
          {submittedSuccess ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <CheckCircle2 size={46} color="var(--success)" style={{ margin: '0 auto 0.5rem auto' }} />
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Assignment Submitted Successfully!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your submission has been logged and sent to your professor.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Upload Document (PDF, ZIP, DOCX)</label>
                <input
                  type="file"
                  onChange={(e) => setFileName(e.target.files[0]?.name || '')}
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Student Comments / GitHub Repository URL</label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Include any notes or code repository links here..."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSubmitModalAsn(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Submission
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
};
