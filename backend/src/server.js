import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

// Import routes
import authRoutes from './routes/auth.js';
import firmsRoutes from './routes/firms.js';
import companiesRoutes from './routes/companies.js';
import consultantsRoutes from './routes/consultants.js';
import contractsRoutes from './routes/contracts.js';
import filesRoutes from './routes/files.js';

// Import job processors
import { fileProcessingQueue, emailQueue } from './jobs/queues.js';
import './jobs/processors.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bull Board (Job Queue Dashboard)
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(fileProcessingQueue),
    new BullMQAdapter(emailQueue),
  ],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/firms', firmsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/consultants', consultantsRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/files', filesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Bull Board: http://localhost:${PORT}/admin/queues`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});

export default app;

