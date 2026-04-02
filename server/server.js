const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://decisionsupportsystemforstudent.netlify.app',
    'https://anukritisrivastava810-source.github.io'
  ],
  credentials: true,
}));
app.use(express.json());

// Wait for DB then Boot Server
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // 1. Force DB Connection First
    await connectDB();
    console.log("[Server] 🔌 Database established");

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

    // Enhanced Health check (Real Readiness)
    app.get('/api/health', (req, res) => {
      const mongoose = require('mongoose');
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      res.json({ 
        status: 'ok', 
        db: dbStatus,
        service: 'Decision Support API',
        timestamp: new Date().toISOString()
      });
    });

    // 3. Bind to Port
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Production Server Ready on Port ${PORT}`);
    });

  } catch (err) {
    console.error("[Server] ❌ Critical Startup Failure:", err.message);
    process.exit(1);
  }
}

startServer();

