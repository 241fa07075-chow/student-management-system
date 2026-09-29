import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CalendarCheck,
  Download,
  Printer,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';

export const StudentReports = () => {
  const [reports, setReports] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'academic' | 'semester'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const data = await api.reports.getStudentReports();
      setReports(data);
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) return <div>Generating analytic reports...</div>;

  const { attendanceOverview, academicPerformance } = reports;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student Reports & Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Comprehensive performance audits, semester benchmarks, and attendance compliance
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Printer size={15} /> Print Full Audit Report
        </button>
      </div>

      {/* Tabs */}
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
          onClick={() => setActiveTab('attendance')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'attendance' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'attendance' ? 'white' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          <CalendarCheck size={16} /> Attendance Report
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'academic' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'academic' ? 'white' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          <Award size={16} /> Academic Performance Report
        </button>

        <button
          onClick={() => setActiveTab('semester')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'semester' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'semester' ? 'white' : 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          <TrendingUp size={16} /> Semester Progress Report
        </button>
      </div>

      {/* TAB 1: Attendance Report */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Compliance</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
                {attendanceOverview.overall}%
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+12% above required 75% benchmark</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sessions Logged</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {attendanceOverview.attendedSessions} / {attendanceOverview.totalSessions}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Biometric verification recorded</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--info)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Examination Clearance</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--info)', marginTop: '0.25rem' }}>
                Eligible
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 600 }}>No attendance condonation required</span>
            </div>
          </div>

          {/* Monthly Attendance Chart (SVG Bar Chart) */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BarChart3 size={18} color="var(--primary)" /> Monthly Attendance Trend vs Benchmark
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', padding: '1rem 0', borderBottom: '1px solid var(--border-light)' }}>
              {attendanceOverview.monthlyBreakdown.map((item) => (
                <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '60px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{item.attendance}%</span>
                  <div style={{ width: '38px', height: `${item.attendance * 1.8}px`, backgroundColor: 'var(--primary)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: `${item.benchmark * 1.8}px`, left: '-10px', right: '-10px', height: '2px', backgroundColor: 'var(--danger)', zIndex: 2 }} title="75% Minimum Benchmark" />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.month}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)', borderRadius: '2px' }} />
                <span>Monthly Attendance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '2px', backgroundColor: 'var(--danger)' }} />
                <span>Mandatory Threshold (75%)</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Academic Performance Report */}
      {activeTab === 'academic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="grid-3">
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Class Standing</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {academicPerformance.rankInClass}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top decile of batch</span>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Batch Percentile</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
                {academicPerformance.percentile} %ile
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exceeding 94% of peers</span>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cumulative CGPA</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.25rem' }}>
                {academicPerformance.cgpa} / 10.0
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>First Class with Distinction</span>
            </div>
          </div>

          {/* Grade Distribution Breakdown */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Award size={18} color="var(--purple)" /> Grade Distribution this Semester
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {academicPerformance.gradeDistribution.map((item) => (
                <div key={item.grade} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600 }}>Grade {item.grade} • {item.label}</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{item.count} Courses</strong>
                  </div>
                  <ProgressBar
                    value={item.count}
                    max={6}
                    color={item.grade === 'A+' ? 'var(--success)' : item.grade === 'A' ? 'var(--primary)' : 'var(--purple)'}
                    height="8px"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Semester Progress Report */}
      {activeTab === 'semester' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <TrendingUp size={18} color="var(--info)" /> Multi-Semester SGPA Progression Trajectory
              </h3>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Credits Earned</th>
                    <th>SGPA</th>
                    <th>Visual Scale</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {academicPerformance.semesterTrend.map((sem) => (
                    <tr key={sem.semester}>
                      <td><strong>{sem.semester}</strong></td>
                      <td>{sem.credits}</td>
                      <td><strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{sem.sgpa}</strong></td>
                      <td style={{ width: '40%' }}>
                        <ProgressBar value={sem.sgpa * 10} max={100} color="var(--primary)" height="8px" />
                      </td>
                      <td>
                        <Badge variant="success">Completed</Badge>
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
