import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { api } from '../../services/api';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [timetable, setTimetable] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dash, tt, crs, asn, stu] = await Promise.all([
          api.dashboard.getTeacherDashboard().catch(() => null),
          api.timetable.getTeacherTimetable(),
          api.courses.getTeacherCourses(),
          api.assignments.getTeacherAssignments(),
          api.students.getAll()
        ]);
        setDashboardStats(dash?.stats || null);
        setTimetable(tt);
        setCourses(crs);
        setAssignments(asn);
        setStudents(stu);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Teacher Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
        color: 'white',
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.35)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.18)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Faculty Management Console • Academic Session 2026-27
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Welcome, {user?.name || 'Dr. Priya Iyer'}! 🎓
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#e9d5ff', maxWidth: '620px' }}>
            {user?.designation || 'Associate Professor & HOD'} • <strong>{dashboardStats?.todayClasses ?? timetable?.todayClasses?.length ?? 3} lectures</strong> scheduled today with <strong>{dashboardStats?.pendingAssignments ?? 18} assignment reviews</strong> pending.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/teacher/attendance')}
            className="btn"
            style={{ backgroundColor: 'white', color: '#581c87', fontWeight: 700 }}
          >
            <CalendarCheck size={16} /> Take Attendance
          </button>
          <button
            onClick={() => navigate('/teacher/marks')}
            className="btn"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.4)' }}
          >
            <FileText size={16} /> Enter Marks
          </button>
        </div>
      </div>

      {/* Teacher Dashboard Overview Cards (Exact Requirements) */}
      <div className="grid-6">
        <StatCard
          title="Total Students"
          value={dashboardStats?.totalStudents ?? students.length ?? 120}
          subtitle="Across 4 active batches"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Courses"
          value={dashboardStats?.totalCourses ?? courses.length ?? 4}
          subtitle="Department curriculum"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Today's Classes"
          value={dashboardStats?.todayClasses ?? timetable?.todayClasses?.length ?? 3}
          subtitle="2 Theory + 1 Seminar"
          icon={Calendar}
          color="cyan"
        />
        <StatCard
          title="Pending Reviews"
          value={dashboardStats?.pendingAssignments ?? 18}
          subtitle="BCNF assignment tasks"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Avg Attendance"
          value={`${dashboardStats?.averageAttendance ?? 84}%`}
          subtitle="Class average rate"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Avg Performance"
          value={`${dashboardStats?.averagePerformance ?? 81}%`}
          subtitle="Overall class GPA 8.1"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Main Grid: Today's Classes & Course Overview */}
      <div className="grid-2">
        
        {/* Today's Teaching Schedule */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={20} color="var(--primary)" /> Today's Teaching Schedule ({timetable?.today || 'Monday'})
            </h3>
            <button
              onClick={() => navigate('/teacher/timetable')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Full Schedule <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {timetable?.todayClasses?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: item.status === 'In Progress' ? 'var(--primary-light)' : 'var(--bg-surface-hover)',
                  border: item.status === 'In Progress' ? '1px solid var(--primary-border)' : '1px solid var(--border-subtle)',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.subject}
                    </span>
                    <Badge variant={item.status === 'Completed' ? 'info' : item.status === 'In Progress' ? 'primary' : 'warning'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {item.batch} • Venue: <strong>{item.room}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Handled Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BookOpen size={20} color="var(--purple)" /> Active Courses Progress
            </h3>
            <button
              onClick={() => navigate('/teacher/courses')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Manage Courses <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {courses.map((crs) => (
              <div key={crs.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div>
                    <strong>{crs.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>({crs.batch})</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{crs.syllabusProgress}% syllabus</span>
                </div>
                <ProgressBar value={crs.syllabusProgress} max={100} color="var(--purple)" height="6px" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{crs.studentsCount} Students Enrolled</span>
                  <span>Avg Attendance: <strong>{crs.avgAttendance}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Submissions & At-Risk Attendance Alerts */}
      <div className="grid-2">
        
        {/* Pending Assignment Evaluations */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={20} color="var(--amber)" /> Assignment Evaluation Pipeline
            </h3>
            <button
              onClick={() => navigate('/teacher/assignments')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Grade All <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {assignments.map((asn) => (
              <div
                key={asn.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{asn.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {asn.courseName} • Due: {asn.dueDate}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber)' }}>
                    {asn.pendingReviewCount} Pending
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {asn.submittedCount}/{asn.totalStudents} received
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Students Spotlight */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={20} color="var(--info)" /> Quick Student Directory Spotlight
            </h3>
            <button
              onClick={() => navigate('/teacher/students')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              View All {dashboardStats?.totalStudents ?? students.length} Students <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {students.slice(0, 4).map((stu) => (
              <div
                key={stu.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-hover)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{stu.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{stu.rollNo}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {stu.department} • {stu.year}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: stu.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                      {stu.attendance}% Att.
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>GPA: {stu.gpa}</div>
                  </div>
                  <Badge variant={stu.status === 'Active' ? 'success' : 'warning'} size="sm">
                    {stu.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
