import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const StudentTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      const data = await api.timetable.getStudentTimetable();
      setTimetable(data);
      setLoading(false);
    };
    fetchTimetable();
  }, []);

  if (loading) return <div>Loading class timetable...</div>;

  const currentDayClasses = timetable?.weekly?.[selectedDay] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Weekly Academic Schedule</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Semester 5 • CSE Section A • LH-201 / Computing Labs
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={15} /> Save Timetable PDF
        </button>
      </div>

      {/* Day Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.35rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        overflowX: 'auto'
      }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: selectedDay === day ? 'var(--primary)' : 'transparent',
              color: selectedDay === day ? 'white' : 'var(--text-secondary)',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            {day}
            {day === 'Monday' && (
              <span style={{
                marginLeft: '0.4rem',
                fontSize: '0.68rem',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedDay === day ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary-light)',
                color: selectedDay === day ? 'white' : 'var(--primary)'
              }}>
                Today
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Classes Timeline for Selected Day */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calendar size={18} color="var(--primary)" /> Classes on {selectedDay}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {currentDayClasses.filter(c => c.code !== 'LUNCH').length} Academic Sessions Scheduled
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentDayClasses.map((item, index) => {
            const isLunch = item.code === 'LUNCH';
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isLunch ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                  border: isLunch ? '1px dashed var(--border-light)' : '1px solid var(--border-light)',
                  borderLeft: isLunch ? '4px solid var(--text-muted)' : '4px solid var(--primary)',
                  gap: '1.25rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Time Slot */}
                <div style={{ minWidth: '140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <Clock size={15} color="var(--primary)" />
                    <span>{item.time}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                    {isLunch ? 'Break Window' : '60-90 min Lecture'}
                  </span>
                </div>

                {/* Course Details */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    {!isLunch && (
                      <code style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {item.code}
                      </code>
                    )}
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: isLunch ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                      {item.subject}
                    </h4>
                  </div>
                  {!isLunch && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <User size={13} /> {item.teacher}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} /> Venue: <strong>{item.room}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                {!isLunch && (
                  <Badge variant={index === 0 ? 'success' : 'primary'} size="sm">
                    {index === 0 ? 'Completed' : 'Upcoming'}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
