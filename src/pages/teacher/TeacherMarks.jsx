import React, { useState, useEffect } from 'react';
import {
  Award,
  Edit2,
  Save,
  CheckCircle2,
  Calculator,
  Search,
  Filter,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const TeacherMarks = () => {
  const [marksList, setMarksList] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarks();
  }, []);

  const loadMarks = async () => {
    const list = await api.marks.getTeacherMarks();
    setMarksList(list);
    setLoading(false);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editTarget) return;

    await api.marks.updateMark(editTarget.id, {
      assignmentMarks: Number(editTarget.assignmentMarks),
      internalMarks: Number(editTarget.internalMarks),
      examMarks: Number(editTarget.examMarks)
    });

    setToastMsg(`Scores updated for ${editTarget.studentName}`);
    setTimeout(() => setToastMsg(''), 3000);
    setEditTarget(null);
    loadMarks();
  };

  const calculateLiveGrade = (asn = 0, internal = 0, exam = 0) => {
    const total = Number(asn) + Number(internal) + Number(exam);
    if (total >= 90) return { total, grade: 'A+' };
    if (total >= 80) return { total, grade: 'A' };
    if (total >= 70) return { total, grade: 'B+' };
    if (total >= 60) return { total, grade: 'B' };
    if (total >= 50) return { total, grade: 'C' };
    if (total >= 40) return { total, grade: 'D' };
    return { total, grade: 'F' };
  };

  const filtered = marksList.filter(item =>
    item.studentName.toLowerCase().includes(search.toLowerCase()) ||
    item.rollNo.toLowerCase().includes(search.toLowerCase()) ||
    item.studentId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading gradebook marks...</div>;

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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Marks & Grading Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            CS503: Database Management Systems • Internal, Assignment & End-Sem Gradebook
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search student by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {filtered.length} students
          </span>
        </div>
      </div>

      {/* Marks Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Subject</th>
                <th>Assignment (20)</th>
                <th>Internal (30)</th>
                <th>Exam (50)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th style={{ textAlign: 'center' }}>Edit Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><code style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.rollNo}</code></td>
                  <td><strong>{item.studentName}</strong></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.subject}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{item.assignmentMarks}/20</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{item.internalMarks}/30</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{item.examMarks}/50</td>
                  <td>
                    <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {item.total}
                    </strong>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: item.grade.startsWith('A') ? 'var(--success-light)' : 'var(--primary-light)',
                      color: item.grade.startsWith('A') ? 'var(--success-text)' : 'var(--primary)',
                      fontSize: '0.85rem'
                    }}>
                      {item.grade}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => setEditTarget({ ...item })}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    >
                      <Edit2 size={13} /> Edit Marks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MARKS MODAL */}
      {editTarget && (() => {
        const live = calculateLiveGrade(editTarget.assignmentMarks, editTarget.internalMarks, editTarget.examMarks);
        return (
          <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit Scores: ${editTarget.studentName}`}>
            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div><strong>Student:</strong> {editTarget.studentName} ({editTarget.rollNo})</div>
                <div><strong>Subject:</strong> {editTarget.subject}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Assignment Marks (Max: 20)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={editTarget.assignmentMarks}
                  onChange={(e) => setEditTarget({ ...editTarget, assignmentMarks: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Internal Assessment (Max: 30)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={editTarget.internalMarks}
                  onChange={(e) => setEditTarget({ ...editTarget, internalMarks: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  End-Semester / Final Exam (Max: 50)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={editTarget.examMarks}
                  onChange={(e) => setEditTarget({ ...editTarget, examMarks: e.target.value })}
                  required
                />
              </div>

              {/* Live Calculated Total and Grade Box */}
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CALCULATED TOTAL</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {live.total} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>COMPUTED GRADE</span>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: live.grade.startsWith('A') ? 'var(--success-text)' : 'var(--primary)'
                  }}>
                    {live.grade}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                  Save Marks
                </button>
              </div>
            </form>
          </Modal>
        );
      })()}

    </div>
  );
};
