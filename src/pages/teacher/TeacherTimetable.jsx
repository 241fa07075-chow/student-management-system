import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Printer
} from 'lucide-react';
import { api } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      const data = await api.timetable.getTeacherTimetable();
      setTimetable(data);
      setLoading(false);
    };
    fetchTimetable();
  }, []);

  if (loading) return <div>Loading faculty timetable...</div>;

  const currentDayClasses = timetable?.weekly?.[selectedDay] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Faculty Teaching Timetable</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Academic Term 2026-27 • Department of Computer Science & Engineering
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={15} /> Export Faculty Schedule
        </button>
      </div>

      {/* Day Selector */}
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
              backgroundColor: selectedDay === day ? 'var(--purple)' : 'transparent',
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
                backgroundColor: selectedDay === day ? 'rgba(255, 255, 255, 0.25)' : 'var(--purple-light)',
                color: selectedDay === day ? 'white' : 'var(--purple)'
              }}>
                Today
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Teaching Sessions for Selected Day */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calendar size={18} color="var(--purple)" /> Teaching Allocations on {selectedDay}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {currentDayClasses.length} Scheduled Sessions
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentDayClasses.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderLeft: '4px solid var(--purple)',
                gap: '1.25rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ minWidth: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Clock size={15} color="var(--purple)" />
                  <span>{item.time}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                  Allocated Period
                </span>
              </div>

              <div style={{ flex: 1, minWidth: '220px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {item.subject}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Users size={13} /> Batch: <strong>{item.batch}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} /> Room / Venue: <strong>{item.room}</strong>
                  </span>
                </div>
              </div>

              <div>
                <Badge variant={index === 0 ? 'info' : 'purple'} size="sm">
                  {index === 0 ? 'Concluded' : 'Scheduled'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
