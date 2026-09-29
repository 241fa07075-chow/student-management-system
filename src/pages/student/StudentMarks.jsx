import React, { useState, useEffect } from 'react';
import {
  Award,
  Download,
  Printer,
  TrendingUp,
  FileCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const StudentMarks = () => {
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      const data = await api.marks.getStudentMarks();
      setMarksData(data);
      setLoading(false);
    };
    fetchMarks();
  }, []);

  if (loading) return <div>Loading academic score sheets...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Marks & Examination Results</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {marksData.semester} • Apex Institute of Engineering & Technology
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={15} /> Print Transcript
          </button>
        </div>
      </div>

      {/* GPA Performance Summary Cards */}
      <div className="grid-3">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.02))', borderColor: 'var(--primary-border)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Semester Grade Point Average (SGPA)</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {marksData.gpa} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 10.0</span>
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 600 }}>Outstanding Academic Performance</span>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02))', borderColor: 'var(--success-border)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cumulative GPA (CGPA)</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {marksData.cgpa} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 10.0</span>
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consistent upward progression</span>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.02))', borderColor: 'var(--purple-border)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Earned Credits</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {marksData.creditsEarned} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {marksData.totalCredits}</span>
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% courses cleared</span>
        </div>
      </div>

      {/* Detailed Mark Sheet Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Award size={18} color="var(--primary)" /> Detailed Semester 5 Marks Statement
          </h3>
          <span className="badge badge-success">All Clear • No Backlogs</span>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Internals (30)</th>
                <th>Assignments (20)</th>
                <th>Midterm (30)</th>
                <th>End Sem (100)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {marksData.subjects.map((sub) => (
                <tr key={sub.code}>
                  <td><code style={{ fontWeight: 600, color: 'var(--primary)' }}>{sub.code}</code></td>
                  <td><strong>{sub.subject}</strong></td>
                  <td>{sub.credits}</td>
                  <td>{sub.internals}/30</td>
                  <td>{sub.assignments}/20</td>
                  <td>{sub.midterm}/30</td>
                  <td>{sub.endSem}/100</td>
                  <td>
                    <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>{sub.total}</strong>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 800,
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: sub.grade.startsWith('A') ? 'var(--success-light)' : 'var(--primary-light)',
                      color: sub.grade.startsWith('A') ? 'var(--success-text)' : 'var(--primary)',
                      fontSize: '0.85rem'
                    }}>
                      {sub.grade}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{sub.gradePoint.toFixed(1)}</td>
                  <td>
                    <Badge variant="success">Passed</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Semester History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={18} color="var(--info)" /> Semester-wise SGPA Progression History
          </h3>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Academic Semester</th>
                <th>Credits Registered</th>
                <th>SGPA Achieved</th>
                <th>Cumulative CGPA</th>
                <th>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {marksData.semesterHistory.map((s, idx) => (
                <tr key={s.sem}>
                  <td><strong>{s.sem}</strong></td>
                  <td>{s.credits} Credits</td>
                  <td><strong style={{ color: 'var(--primary)' }}>{s.gpa}</strong></td>
                  <td>{(8.0 + (idx * 0.12)).toFixed(2)}</td>
                  <td>
                    <Badge variant="success">First Class with Distinction</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
