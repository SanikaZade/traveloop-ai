import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';

const app = express();

// Middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

import routes from './api/v1/routes/index.js';

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TravelLoop Backend is running',
    docs: '/api/v1',
    health: '/api/v1/health'
  });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TravelLoop API is running' });
});
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TravelLoop API v1 is running' });
});

// API Routes
app.use('/api/v1', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
