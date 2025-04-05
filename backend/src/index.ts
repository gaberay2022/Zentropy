import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import apiRoutes from './routes/api.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image data
app.use(express.urlencoded({ extended: true }));

// Database configuration
export const pool = new Pool({
  user: process.env.DB_USER || 'zentropy_user',
  password: process.env.DB_PASSWORD || 'zentropy_password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'zentropydb',
  ssl: false
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('Connected to database:', result.rows[0]);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

testConnection();

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err: Error) => {
  console.log('Uncaught Exception:', err.message);
});

export default app;