const express = require('express');
const cors = require('cors');
require('dotenv').config();
const os = require('os');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const classRoutes = require('./routes/classRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware for all API routes
app.use('/api', requestLogger);

app.use((req, res, next) => {
  res.setHeader('X-Handled-By', os.hostname());
  next();
});

// --- Health and Readiness Probes ---

// Liveness probe: Checks if the application process is running.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Readiness probe: Checks if the application is ready to handle requests (e.g., DB is connected).
app.get('/ready', async (req, res) => {
  try {
    // Perform a simple query to check database connectivity.
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', message: 'Database connection is healthy.' });
  } catch (error) {
    console.error('Readiness check failed:', error);
    res.status(503).json({ status: 'error', message: 'Database connection is not healthy.' });
  }
});


// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
