import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentProfile } from '../pages/student/StudentProfile';
import { StudentAttendance } from '../pages/student/StudentAttendance';
import { StudentCourses } from '../pages/student/StudentCourses';
import { StudentMarks } from '../pages/student/StudentMarks';
import { StudentAssignments } from '../pages/student/StudentAssignments';
import { StudentTimetable } from '../pages/student/StudentTimetable';
import { StudentNotifications } from '../pages/student/StudentNotifications';
import { StudentReports } from '../pages/student/StudentReports';
import { StudentSettings } from '../pages/student/StudentSettings';

// Teacher Pages
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { TeacherProfile } from '../pages/teacher/TeacherProfile';
import { TeacherStudents } from '../pages/teacher/TeacherStudents';
import { TeacherCourses } from '../pages/teacher/TeacherCourses';
import { TeacherAttendance } from '../pages/teacher/TeacherAttendance';
import { TeacherMarks } from '../pages/teacher/TeacherMarks';
import { TeacherAssignments } from '../pages/teacher/TeacherAssignments';
import { TeacherTimetable } from '../pages/teacher/TeacherTimetable';
import { TeacherReports } from '../pages/teacher/TeacherReports';
import { TeacherNotifications } from '../pages/teacher/TeacherNotifications';
import { TeacherSettings } from '../pages/teacher/TeacherSettings';

export const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Protected Student Portal Routes */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="marks" element={<StudentMarks />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="reports" element={<StudentReports />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Route>

      {/* Protected Teacher Portal Routes */}
      <Route element={<ProtectedRoute allowedRole="teacher" />}>
        <Route path="/teacher" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="marks" element={<TeacherMarks />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="timetable" element={<TeacherTimetable />} />
          <Route path="reports" element={<TeacherReports />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
