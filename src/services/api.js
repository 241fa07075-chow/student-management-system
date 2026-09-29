import axios from 'axios';

// Dynamically resolve API URL: supports localhost, local network IP, and VITE_API_URL override
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If running in browser and accessed via LAN IP or hostname other than localhost, use that hostname
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000/api`;
  }
  return envUrl || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sms_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthenticated
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or unauthorized on protected route (except login), clear and redirect
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('sms_auth_token');
        localStorage.removeItem('sms_user_role');
        sessionStorage.setItem('sms_auth_error', 'Your session has expired. Please login again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    async login(email, password) {
      const res = await apiClient.post('/auth/login', { email, password });
      return res.data;
    },
    async register(userData) {
      const res = await apiClient.post('/auth/register', userData);
      return res.data;
    },
    async getMe() {
      const res = await apiClient.get('/auth/me');
      return res.data;
    },
    async checkHealth() {
      const res = await apiClient.get('/health');
      return res.data;
    }
  },

  dashboard: {
    async getStudentDashboard() {
      const res = await apiClient.get('/student/dashboard');
      return res.data.data;
    },
    async getTeacherDashboard() {
      const res = await apiClient.get('/teacher/dashboard');
      return res.data.data;
    }
  },

  students: {
    async getAll(params = {}) {
      const res = await apiClient.get('/students', { params });
      return res.data.data;
    },
    async getById(id) {
      const res = await apiClient.get(`/students/${id}`);
      return res.data.data;
    },
    async getMyProfile() {
      const res = await apiClient.get('/students/profile/me');
      return res.data.data;
    },
    async create(studentData) {
      const res = await apiClient.post('/students', studentData);
      return res.data.data;
    },
    async update(id, updatedData) {
      const res = await apiClient.put(`/students/${id}`, updatedData);
      return res.data.data;
    },
    async delete(id) {
      const res = await apiClient.delete(`/students/${id}`);
      return res.data;
    }
  },

  teachers: {
    async getAll() {
      const res = await apiClient.get('/teachers');
      return res.data.data;
    },
    async getById(id) {
      const res = await apiClient.get(`/teachers/${id}`);
      return res.data.data;
    },
    async getMyProfile() {
      const res = await apiClient.get('/teachers/profile/me');
      return res.data.data;
    },
    async update(id, updatedData) {
      const res = await apiClient.put(`/teachers/${id}`, updatedData);
      return res.data.data;
    }
  },

  courses: {
    async getStudentCourses() {
      const res = await apiClient.get('/courses');
      return res.data.data;
    },
    async getTeacherCourses() {
      const res = await apiClient.get('/courses');
      return res.data.data;
    },
    async getById(id) {
      const res = await apiClient.get(`/courses/${id}`);
      return res.data.data;
    },
    async create(courseData) {
      const res = await apiClient.post('/courses', courseData);
      return res.data.data;
    },
    async update(id, data) {
      const res = await apiClient.put(`/courses/${id}`, data);
      return res.data.data;
    },
    async delete(id) {
      const res = await apiClient.delete(`/courses/${id}`);
      return res.data;
    }
  },

  attendance: {
    async getStudentAttendance(studentId) {
      if (studentId) {
        const res = await apiClient.get(`/attendance/student/${studentId}`);
        return res.data.data;
      }
      const res = await apiClient.get('/attendance/me');
      return res.data.data;
    },
    async getTeacherRoster(courseCode, date) {
      const res = await apiClient.get('/attendance/roster', {
        params: { courseCode, date }
      });
      return res.data.data;
    },
    async saveTeacherRoster(courseCode, date, roster) {
      const res = await apiClient.post('/attendance', {
        courseCode,
        date,
        roster
      });
      return res.data;
    },
    async getTeacherSummary() {
      const res = await apiClient.get('/attendance/summary');
      return res.data.data;
    }
  },

  marks: {
    async getStudentMarks(studentId) {
      if (studentId) {
        const res = await apiClient.get(`/marks/student/${studentId}`);
        return res.data.data;
      }
      const res = await apiClient.get('/marks/me');
      return res.data.data;
    },
    async getTeacherMarks(courseCode) {
      const res = await apiClient.get('/marks/roster', {
        params: { courseCode }
      });
      return res.data.data;
    },
    async updateMark(id, marksData) {
      const res = await apiClient.put(`/marks/${id}`, marksData);
      return res.data.data;
    }
  },

  assignments: {
    async getStudentAssignments() {
      const res = await apiClient.get('/assignments');
      return res.data.data;
    },
    async getTeacherAssignments() {
      const res = await apiClient.get('/assignments');
      return res.data.data;
    },
    async submitStudentAssignment(assignmentId, submissionDetails) {
      const res = await apiClient.post(`/assignments/${assignmentId}/submit`, submissionDetails);
      return res.data;
    },
    async createAssignment(assignmentData) {
      const res = await apiClient.post('/assignments', assignmentData);
      return res.data.data;
    },
    async delete(id) {
      const res = await apiClient.delete(`/assignments/${id}`);
      return res.data;
    }
  },

  timetable: {
    async getStudentTimetable() {
      const res = await apiClient.get('/timetable');
      return res.data.data;
    },
    async getTeacherTimetable() {
      const res = await apiClient.get('/timetable');
      return res.data.data;
    }
  },

  notifications: {
    async getStudentNotifications() {
      const res = await apiClient.get('/notifications');
      return res.data.data;
    },
    async getTeacherNotifications() {
      const res = await apiClient.get('/notifications');
      return res.data.data;
    },
    async markStudentNotificationRead(id) {
      await apiClient.put(`/notifications/${id}/read`);
      return this.getStudentNotifications();
    },
    async markAllStudentRead() {
      await apiClient.put('/notifications/read-all');
      return this.getStudentNotifications();
    },
    async markTeacherNotificationRead(id) {
      await apiClient.put(`/notifications/${id}/read`);
      return this.getTeacherNotifications();
    },
    async markAllTeacherRead() {
      await apiClient.put('/notifications/read-all');
      return this.getTeacherNotifications();
    },
    async sendAnnouncement(notificationData) {
      const res = await apiClient.post('/notifications/broadcast', notificationData);
      return res.data;
    }
  },

  reports: {
    async getStudentReports(studentId) {
      const id = studentId || 'STU001';
      const res = await apiClient.get(`/reports/student/${id}`);
      return res.data.data;
    },
    async getTeacherReports() {
      const res = await apiClient.get('/reports/teacher');
      return res.data.data;
    }
  }
};

export default apiClient;
