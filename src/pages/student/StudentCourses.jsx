import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  User,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.courses.getStudentCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (loading) return <div>Loading course curricula...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Enrolled Courses</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Current Semester 5 • Total Registered Credits: 24 (6 Core Subjects)
          </p>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${course.color || 'var(--primary)'}`
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: course.color || 'var(--primary)',
                  backgroundColor: 'var(--bg-surface-hover)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {course.code}
                </span>
                <Badge variant="purple" size="sm">{course.credits} Credits</Badge>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
                {course.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={15} color="var(--text-muted)" />
                  <span><strong>Instructor:</strong> {course.instructor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={15} color="var(--text-muted)" />
                  <span><strong>Schedule:</strong> {course.schedule}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--text-muted)" />
                  <span><strong>Venue:</strong> {course.room}</span>
                </div>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Syllabus Covered</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} max={100} color={course.color || 'var(--primary)'} height="6px" />
              </div>

              <button
                onClick={() => setSelectedCourse(course)}
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
              >
                View Syllabus Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Syllabus Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`${selectedCourse.code}: ${selectedCourse.name}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <div><strong>Instructor:</strong> {selectedCourse.instructor}</div>
              <div><strong>Credits:</strong> {selectedCourse.credits} • <strong>Lecture Hall:</strong> {selectedCourse.room}</div>
              <div><strong>Timing:</strong> {selectedCourse.schedule}</div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>Course Modules & Syllabus Outline:</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedCourse.syllabus}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>Evaluation Scheme:</h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Internal Assessments (2 tests): 30%</li>
                <li>Assignments, Labs & Quizzes: 20%</li>
                <li>Comprehensive End Semester Exam: 50%</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedCourse(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
