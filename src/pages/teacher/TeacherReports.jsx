import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  CalendarCheck,
  AlertTriangle,
  Printer,
  Download,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';

export const TeacherReports = () => {
  const [reports, setReports] = useState(null);
  const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'attendance' | 'courses'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const data = await api.reports.getTeacherReports();
      setReports(data);
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) return <div>Compiling faculty academic analytics...</div>;

  const { classPerformanceOverview, attendanceStatistics, courseMetrics } = reports;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Department Analytics & Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Faculty Evaluation Dashboard • 120 Students Across 4 Managed Classes
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Printer size={15} /> Print Analytics Dossier
        </button>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.35rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab('performance')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'performance' ? 'var(--purple)' : 'transparent',
            color: activeTab === 'performance' ? 'white' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          <Award size={16} /> Student Performance Report
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'attendance' ? 'var(--purple)' : 'transparent',
            color: activeTab === 'attendance' ? 'white' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          <CalendarCheck size={16} /> Attendance Compliance Report
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'courses' ? 'var(--purple)' : 'transparent',
            color: activeTab === 'courses' ? 'white' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          <BookOpen size={16} /> Course Progress Report
        </button>
      </div>

      {/* TAB 1: Student Performance Report */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid-4">
            <div className="card" style={{ borderLeft: '4px solid var(--purple)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cohort Average GPA</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.2rem' }}>
                {classPerformanceOverview.averageGpa} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 10</span>
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>120 active students evaluated</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pass Rate Percentage</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>
                {classPerformanceOverview.passPercentage}%
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 600 }}>Exceeds department goal</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Batch Valedictorian</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>
                {classPerformanceOverview.topPerformer}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distinction Rank #1</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Students At-Risk</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.2rem' }}>
                {classPerformanceOverview.studentsAtRisk} Students
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>Recommended for remedial tutorial</span>
            </div>
          </div>

          {/* Grade Distribution Visualization */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BarChart3 size={18} color="var(--purple)" /> Grade Distribution Spectrum
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {classPerformanceOverview.gradeDistribution.map((item) => (
                <div key={item.grade} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.grade}</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{item.count} Students ({item.percentage}%)</strong>
                  </div>
                  <ProgressBar
                    value={item.percentage}
                    max={100}
                    color="var(--purple)"
                    height="8px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Attendance Compliance Report */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Attendance Average</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
                {attendanceStatistics.overallAttendance}%
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 4 departmental courses</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Attendance &gt; 85%</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {attendanceStatistics.above85Percent} Students
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exemplary attendance status</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Defaulters (&lt; 75%)</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.25rem' }}>
                {attendanceStatistics.below75Risk} Students
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>De-barred from examinations</span>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <CalendarCheck size={18} color="var(--purple)" /> Monthly Attendance Trend
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', padding: '1rem 0' }}>
              {attendanceStatistics.monthlyClassAttendance.map((m) => (
                <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--purple)' }}>{m.rate}%</span>
                  <div style={{ width: '42px', height: `${m.rate * 1.6}px`, backgroundColor: 'var(--purple)', borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Course Progress Report */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BookOpen size={18} color="var(--purple)" /> Course Performance & Completion Index
              </h3>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Course & Section</th>
                    <th>Students Enrolled</th>
                    <th>Average Marks</th>
                    <th>Average Attendance</th>
                    <th>On-Time Submissions</th>
                    <th>Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courseMetrics.map((c) => (
                    <tr key={c.course}>
                      <td><strong>{c.course}</strong></td>
                      <td>{c.enrolled} Students</td>
                      <td><strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{c.avgMarks}/100</strong></td>
                      <td><strong style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>{c.avgAttendance}%</strong></td>
                      <td>{c.submissionsOnTime}</td>
                      <td>
                        <Badge variant="success">Compliant</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
