import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Award,
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.dashboard.getStudentDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
        setError('Failed to fetch dashboard data from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--border-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem auto'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading student metrics from MongoDB database...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    attendance: 85.3,
    attendanceStatus: 'Eligible',
    attendanceWarning: null,
    gpa: 8.6,
    enrolledCourses: 6,
    pendingAssignments: 3,
    totalCredits: 24,
    overallPerformance: 86
  };

  const attendanceBreakdown = dashboardData?.attendanceBreakdown || [];
  const marksBreakdown = dashboardData?.marksBreakdown || [];
  const upcomingAssignments = dashboardData?.upcomingAssignments || [];
  const todayClasses = dashboardData?.todaySchedule?.classes || [];
  const isShortage = stats.attendance < 75;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
        color: 'white',
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.35)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.18)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Fall Semester 2026 • Live Database
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Welcome back, {user?.name || dashboardData?.student?.name || 'Demo Student'}! 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#bfdbfe', maxWidth: '600px' }}>
            {dashboardData?.student?.department || 'Computer Science'} • {dashboardData?.student?.studentId || 'STU001'} • <strong>{todayClasses.length} classes</strong> scheduled today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/student/assignments')}
            className="btn"
            style={{ backgroundColor: 'white', color: '#1e3a8a', fontWeight: 700 }}
          >
            <FileText size={16} /> View Tasks ({stats.pendingAssignments})
          </button>
          <button
            onClick={() => navigate('/student/timetable')}
            className="btn"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.4)' }}
          >
            <Calendar size={16} /> Routine
          </button>
        </div>
      </div>

      {/* Mandatory 75% Attendance Warning Banner (if approaching or in shortage) */}
      {stats.attendanceWarning && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: isShortage ? 'var(--danger-light)' : 'var(--warning-light)',
          color: isShortage ? 'var(--danger-text)' : 'var(--warning-text)',
          border: `1px solid ${isShortage ? 'var(--danger-border)' : 'var(--warning-border)'}`,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <AlertTriangle size={22} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              {isShortage ? 'ATTENDANCE SHORTAGE ALERT' : 'ATTENDANCE THRESHOLD ADVISORY'}
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
              {stats.attendanceWarning}
            </div>
          </div>
          <button
            onClick={() => navigate('/student/attendance')}
            className="btn btn-sm"
            style={{
              backgroundColor: isShortage ? 'var(--danger)' : 'var(--warning)',
              color: 'white'
            }}
          >
            View Details
          </button>
        </div>
      )}

      {/* Dashboard Overview Cards */}
      <div className="grid-6">
        <StatCard
          title="Attendance"
          value={`${stats.attendance}%`}
          subtitle={stats.attendance >= 75 ? "Status: Eligible" : "Status: Shortage"}
          icon={CalendarCheck}
          color={stats.attendance >= 75 ? "emerald" : "rose"}
        />
        <StatCard
          title="Current GPA"
          value={stats.gpa?.toString()}
          subtitle="Semester 5 GPA"
          icon={Award}
          color="blue"
        />
        <StatCard
          title="Courses"
          value={stats.enrolledCourses?.toString()}
          subtitle="Enrolled curriculum"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingAssignments?.toString()}
          subtitle="Assignments to submit"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Total Credits"
          value={stats.totalCredits?.toString()}
          subtitle="Semester course load"
          icon={Layers}
          color="cyan"
        />
        <StatCard
          title="Performance"
          value={`${stats.overallPerformance}%`}
          subtitle="Composite score"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Visual Mandatory 75% Progress Bar Card */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', borderLeft: `4px solid ${isShortage ? 'var(--danger)' : 'var(--success)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mandatory Minimum Attendance Rule (75%)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Attendance: {stats.attendance}%</span>
              <Badge variant={isShortage ? 'danger' : 'success'}>
                {isShortage ? 'Attendance Shortage' : 'Eligible'}
              </Badge>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Strict Rule: <strong>75% minimum required</strong> for examination eligibility
          </div>
        </div>

        {/* Visual Progress Bar with Explicit 75% Mark */}
        <div style={{ position: 'relative', width: '100%', height: '14px', backgroundColor: 'var(--border-light)', borderRadius: '9999px', overflow: 'visible', margin: '0.75rem 0' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${Math.min(stats.attendance, 100)}%`,
            backgroundColor: isShortage ? 'var(--danger)' : 'var(--success)',
            borderRadius: '9999px',
            transition: 'width 0.8s ease-out'
          }} />
          {/* Explicit 75% Requirement Pin Marker */}
          <div style={{
            position: 'absolute',
            left: '75%',
            top: '-6px',
            bottom: '-6px',
            width: '3px',
            backgroundColor: '#0f172a',
            zIndex: 10,
            boxShadow: '0 0 4px rgba(0,0,0,0.5)'
          }}>
            <span style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.68rem',
              fontWeight: 800,
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '1px 5px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}>
              75% Min
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Attendance & Academic Performance */}
      <div className="grid-2">
        
        {/* Subject-Wise Attendance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CalendarCheck size={20} color="var(--primary)" /> Subject-Wise Attendance
            </h3>
            <button
              onClick={() => navigate('/student/attendance')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Full Log <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {attendanceBreakdown.map((sub) => (
              <div key={sub.subjectCode || sub.code} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sub.subjectName || sub.name}
                    </span>
                    <Badge variant={sub.status === 'Eligible' ? 'success' : 'danger'} size="sm">
                      {sub.status || (sub.percentage >= 75 ? 'Eligible' : 'Shortage')}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sub.attended || sub.present}/{sub.held || sub.total}
                    </span>
                    <span style={{
                      fontWeight: 700,
                      color: sub.percentage >= 75 ? 'var(--success)' : 'var(--danger)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {sub.percentage}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={sub.percentage}
                  max={100}
                  color={sub.percentage >= 85 ? 'var(--success)' : sub.percentage >= 75 ? 'var(--primary)' : 'var(--danger)'}
                  height="7px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Academic Performance / Grades Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Award size={20} color="var(--purple)" /> Academic Performance (Grades)
            </h3>
            <button
              onClick={() => navigate('/student/marks')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Mark Sheet <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {marksBreakdown.map((item) => (
              <div
                key={item.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'var(--transition)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {item.code}
                    </span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.subject}</h4>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.credits} Credits • Total: {item.total}/100
                  </span>
                </div>

                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: item.grade?.startsWith('A') ? 'var(--success-light)' : 'var(--primary-light)',
                  color: item.grade?.startsWith('A') ? 'var(--success-text)' : 'var(--primary)',
                  border: `1px solid ${item.grade?.startsWith('A') ? 'var(--success-border)' : 'var(--primary-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}>
                  {item.grade}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calculated Semester GPA</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {stats.gpa} / 10.0
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Upcoming Assignments & Today's Timetable */}
      <div className="grid-2">
        {/* Upcoming Assignments */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={20} color="var(--amber)" /> Pending Assignments
            </h3>
            <button
              onClick={() => navigate('/student/assignments')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              All Assignments <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {upcomingAssignments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending assignments! All caught up.</p>
            ) : (
              upcomingAssignments.slice(0, 3).map((asn) => (
                <div
                  key={asn.id || asn._id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {asn.title}
                    </h4>
                    <Badge variant={asn.priority === 'High' ? 'danger' : 'warning'} size="sm">
                      {asn.status}
                    </Badge>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Subject: <strong>{asn.subject}</strong></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--danger-text)', fontWeight: 600 }}>
                      <Clock size={13} /> Due: {asn.dueDate}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={20} color="var(--info)" /> Today's Routine
            </h3>
            <button
              onClick={() => navigate('/student/timetable')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Weekly Schedule <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayClasses.map((cls, idx) => (
              <div
                key={cls.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: cls.status === 'Completed' ? 'var(--bg-surface-hover)' : 'var(--primary-light)',
                  border: `1px solid ${cls.status === 'Completed' ? 'var(--border-subtle)' : 'var(--primary-border)'}`
                }}
              >
                <div style={{ minWidth: '95px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {cls.time.split(' - ')[0]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {cls.room}
                  </div>
                </div>

                <div style={{ width: '2px', height: '36px', backgroundColor: 'var(--border-light)' }} />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cls.subject}
                    </span>
                    <Badge variant={cls.status === 'Completed' ? 'info' : 'primary'} size="sm">
                      {cls.status}
                    </Badge>
                  </div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {cls.instructor} • {cls.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
