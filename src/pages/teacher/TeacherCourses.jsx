import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  CalendarCheck,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';

export const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.courses.getTeacherCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (loading) return <div>Loading assigned teaching courses...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Courses Taught & Curriculum</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Faculty Allocation: 4 Courses • 220 Cumulative Students Enrolled • Fall 2026
          </p>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '4px solid var(--purple)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--purple)',
                  backgroundColor: 'var(--purple-light)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {course.code}
                </span>
                <Badge variant="purple" size="sm">{course.credits} Academic Credits</Badge>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {course.name}
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Target Batch: {course.batch}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={15} color="var(--text-muted)" />
                  <span>Enrolled Capacity: <strong>{course.studentsCount} Students</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={15} color="var(--text-muted)" />
                  <span>Lecture Timings: <strong>{course.schedule}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--text-muted)" />
                  <span>Assigned Hall: <strong>{course.room}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={15} color="var(--text-muted)" />
                  <span>Upcoming Evaluation: <strong style={{ color: 'var(--purple)' }}>{course.upcomingExam}</strong></span>
                </div>
              </div>
            </div>

            {/* Performance & Progress Indicators */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Average Attendance</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--success)' }}>{course.avgAttendance}%</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Class Average Marks</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>{course.avgMarks}/100</strong>
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Syllabus Module Delivery</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{course.syllabusProgress}%</span>
                </div>
                <ProgressBar value={course.syllabusProgress} max={100} color="var(--purple)" height="6px" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
