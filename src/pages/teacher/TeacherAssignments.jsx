import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  CheckCheck,
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    courseName: 'Database Management Systems',
    batch: 'CSE 3rd Year (Sec A)',
    dueDate: '',
    maxMarks: 20,
    totalStudents: 62,
    description: ''
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const list = await api.assignments.getTeacherAssignments();
    setAssignments(list);
    setLoading(false);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    await api.assignments.createAssignment(formData);
    setIsCreateOpen(false);
    setFormData({
      title: '',
      courseName: 'Database Management Systems',
      batch: 'CSE 3rd Year (Sec A)',
      dueDate: '',
      maxMarks: 20,
      totalStudents: 62,
      description: ''
    });
    setToastMsg('New Assignment published to student portal!');
    setTimeout(() => setToastMsg(''), 3000);
    loadAssignments();
  };

  if (loading) return <div>Loading assignment manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Assignment Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Publish homework assignments, review student submissions & assign continuous evaluation grades
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
        >
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      {/* Assignments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {assignments.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              borderLeft: item.pendingReviewCount > 0 ? '4px solid var(--amber)' : '4px solid var(--success)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Badge variant="purple" size="sm">{item.courseName}</Badge>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {item.batch}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant={item.status === 'Active' ? 'warning' : 'success'}>
                  {item.status}
                </Badge>
                <Badge variant="primary">Max: {item.maxMarks} Marks</Badge>
              </div>
            </div>

            {/* Submission Status Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-surface-hover)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem' }}>Total Enrolled</span>
                <strong>{item.totalStudents} Students</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem' }}>Submissions Received</span>
                <strong style={{ color: 'var(--success)' }}>{item.submittedCount} Submitted</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem' }}>Pending Grading</span>
                <strong style={{ color: 'var(--amber)' }}>{item.pendingReviewCount} Unreviewed</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem' }}>Deadline</span>
                <strong style={{ color: 'var(--danger-text)' }}>{item.dueDate}</strong>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setReviewTarget(item)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', gap: '0.35rem' }}
              >
                <Eye size={14} /> Review Student Submissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Course Assignment">
        <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Assignment Title</label>
            <input
              type="text"
              placeholder="e.g. Distributed Consensus Algorithms & Raft Simulation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Course</label>
              <select
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              >
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Advanced Distributed Systems">Advanced Distributed Systems</option>
                <option value="Data Structures Lab & Practice">Data Structures Lab & Practice</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Batch</label>
              <select
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              >
                <option value="CSE 3rd Year (Sec A)">CSE 3rd Year (Sec A)</option>
                <option value="IT 3rd Year (Sec B)">IT 3rd Year (Sec B)</option>
                <option value="CSE 4th Year Elective">CSE 4th Year Elective</option>
                <option value="CSE 2nd Year (Sec A)">CSE 2nd Year (Sec A)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Due Date</label>
              <input
                type="text"
                placeholder="e.g. 15 October 2026"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Maximum Marks</label>
              <input
                type="number"
                min="5"
                max="100"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Task Instructions & Problem Statement</label>
            <textarea
              rows={3}
              placeholder="Detailed guidelines, rubrics, and deliverable format for students..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* REVIEW SUBMISSIONS MODAL */}
      {reviewTarget && (
        <Modal isOpen={!!reviewTarget} onClose={() => setReviewTarget(null)} title={`Submissions: ${reviewTarget.title}`} maxWidth="650px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <div><strong>Course:</strong> {reviewTarget.courseName} ({reviewTarget.batch})</div>
              <div><strong>Due Date:</strong> {reviewTarget.dueDate} • <strong>Max Marks:</strong> {reviewTarget.maxMarks}</div>
            </div>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Recent Student Deliverables:</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '300px', overflowY: 'auto' }}>
              {[
                { name: 'Aarav Sharma', roll: '21CS042', status: 'Submitted on time', file: 'Relational_Schema_Proofs.pdf', graded: false },
                { name: 'Sneha Reddy', roll: '21CS043', status: 'Submitted on time', file: 'BCNF_Decomp_Sneha.pdf', graded: true, score: '20/20' },
                { name: 'Ananya Patel', roll: '21IT019', status: 'Submitted on time', file: 'Ananya_DBMS_Assn1.pdf', graded: true, score: '19/20' },
                { name: 'Vikram Singhania', roll: '22EC015', status: 'Submitted on time', file: 'Vikram_Solution.zip', graded: false }
              ].map((sub, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{sub.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({sub.roll})</span></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>📎 {sub.file}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {sub.graded ? (
                      <Badge variant="success">Score: {sub.score}</Badge>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          alert(`Graded ${sub.name} with ${reviewTarget.maxMarks}/${reviewTarget.maxMarks} points!`);
                        }}
                      >
                        Grade Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setReviewTarget(null)}>Done</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
