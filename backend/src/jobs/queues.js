import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Initialize Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// File Processing Queue
export const fileProcessingQueue = new Queue('file-processing', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Email Queue
export const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Data Sync Queue (for syncing with external systems)
export const dataSyncQueue = new Queue('data-sync', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
  },
});

// Report Generation Queue
export const reportQueue = new Queue('reports', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 3000,
    },
  },
});

export { connection };

