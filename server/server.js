const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB, isDBConnected } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { seedDatabase } = require('./seed/seedData');
const User = require('./models/User');

// Import Route handlers
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const marksRoutes = require('./routes/marksRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Security Headers
app.use(helmet());

// CORS configuration (configured for React / Vite frontend)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or matching client URLs
      if (!origin || origin === CLIENT_URL || origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
        callback(null, true);
      } else {
        callback(null, true); // Permissive during local development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.'
  }
});
app.use('/api/auth', authLimiter);

// Health Check Endpoint (Exact Requirement)
app.get('/api/health', (req, res) => {
  const dbStatus = isDBConnected() ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    message: 'Student Management API is running',
    database: dbStatus,
    timestamp: new Date()
  });
});

// Import specific controllers for direct route aliases
const { protect } = require('./middleware/authMiddleware');
const { authorizeRoles } = require('./middleware/roleMiddleware');
const { getStudentDashboard, getTeacherDashboard } = require('./controllers/reportController');

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// Direct Aliases for dashboard endpoints as requested in prompt
app.get('/api/student/dashboard', protect, authorizeRoles('student'), getStudentDashboard);
app.get('/api/teacher/dashboard', protect, authorizeRoles('teacher'), getTeacherDashboard);

// Root test route
app.get('/', (req, res) => {
  res.json({
    message: 'EduPulse Student Management System Backend API v1.0',
    documentation: '/api/health'
  });
});

// 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server and Connect DB
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const demoUser = await User.findOne({ email: 'student@demo.com' });
    if (!demoUser) {
      console.log('Demo accounts not detected. Initializing database with seed data...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
  }
};

startServer();

module.exports = app;
