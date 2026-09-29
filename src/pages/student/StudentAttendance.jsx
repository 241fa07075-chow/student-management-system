import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  Download,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';

export const StudentAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [filterSubject, setFilterSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      const data = await api.attendance.getStudentAttendance();
      setAttendance(data);
      setLoading(false);
    };
    fetchAttendance();
  }, []);

  if (loading) return <div>Loading attendance records...</div>;

  const filteredLogs = filterSubject === 'All'
    ? attendance.recentLogs
    : attendance.recentLogs.filter(log => log.subject.includes(filterSubject));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Attendance Records</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Semester 5 • Minimum 75% attendance mandatory for semester examinations
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={15} /> Export Report
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid-4">
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Attendance</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>
            {attendance.overallPercentage}%
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe zone (&gt;75% mandatory)</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Sessions Held</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {attendance.totalClassesHeld}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 6 enrolled subjects</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--info)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sessions Attended</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--info)', marginTop: '0.2rem' }}>
            {attendance.totalClassesAttended}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified electronic biometric</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sessions Missed</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.2rem' }}>
            {attendance.totalClassesMissed}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Excused & medical leaves</span>
        </div>
      </div>

      {/* Subject-Wise Detailed Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <CalendarCheck size={18} color="var(--primary)" /> Course Attendance Breakdown
          </h3>
          <span className="badge badge-success">Exam Eligible in All Subjects</span>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Held</th>
                <th>Attended</th>
                <th>Missed</th>
                <th style={{ minWidth: '180px' }}>Percentage Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.subjects.map((sub) => (
                <tr key={sub.subjectCode}>
                  <td><code style={{ fontWeight: 600, color: 'var(--primary)' }}>{sub.subjectCode}</code></td>
                  <td><strong>{sub.subjectName}</strong></td>
                  <td>{sub.held}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>{sub.attended}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{sub.held - sub.attended}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <ProgressBar
                          value={sub.percentage}
                          color={sub.percentage >= 85 ? 'var(--success)' : sub.percentage >= 75 ? 'var(--primary)' : 'var(--warning)'}
                          height="7px"
                        />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                        {sub.percentage}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={sub.percentage >= 75 ? 'success' : 'danger'}>
                      {sub.percentage >= 75 ? 'Eligible' : 'Shortage'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={18} color="var(--purple)" /> Recent Class Attendance Log
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Database">Database Management</option>
              <option value="Java">Java Programming</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Networks">Computer Networks</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Subject</th>
                <th>Faculty / Instructor</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{log.date}</td>
                  <td>{log.time}</td>
                  <td><strong>{log.subject}</strong></td>
                  <td>{log.teacher}</td>
                  <td>
                    <Badge variant={log.status === 'Present' ? 'success' : 'danger'}>
                      {log.status === 'Present' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {log.status}
                    </Badge>
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
