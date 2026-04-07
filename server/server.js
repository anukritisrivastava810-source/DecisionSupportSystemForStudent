const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Validate critical env vars at startup
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[Server] ❌ FATAL ERROR: Missing environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();

// ── Security Middleware ──────────────────────────────────────────────
// Helmet sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet());

// CORS: allow only known origins
const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://anukritisrivastava810-source.github.io'
];
// Note: Origin headers do not contain paths, so we only need the domain.
const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Mobile apps, Postman, curl, etc.

    const strippedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(strippedOrigin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());

// ── Server Boot ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // 1. Force DB Connection First
    await connectDB();
    console.log('[Server] 🔌 Database established');

    // 2. Load Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/skills', require('./routes/skills'));
    app.use('/api/goals', require('./routes/goals'));
    app.use('/api/opportunities', require('./routes/opportunities'));
    app.use('/api/history', require('./routes/history'));
    app.use('/api/dashboard', require('./routes/dashboard'));
    app.use('/api/profile', require('./routes/profile'));
    app.use('/api/domain-info', require('./routes/domainInfo'));
    app.use('/api/career-guide', require('./routes/careerGuide'));
    app.use('/api/admin', require('./routes/admin'));
    app.use('/api/career-search', require('./routes/careerSearch'));

    // Health check (Real Readiness)
    app.get('/api/health', (req, res) => {
      const mongoose = require('mongoose');
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      res.json({
        status: 'ok',
        db: dbStatus,
        service: 'Decision Support API',
        timestamp: new Date().toISOString(),
      });
    });

    // 3. Bind to Port
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Production Server Ready on Port ${PORT}`);
    });

  } catch (err) {
    console.error('[Server] ❌ Critical Startup Failure:', err.message);
    process.exit(1);
  }
}

startServer();
