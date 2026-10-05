import express from 'express';
import cors from 'cors';
import { loadSession } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import gymsRouter from './routes/gyms.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());
app.use(loadSession);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/gyms', gymsRouter);

// Last-resort error handler: log it, never leak internals to the client.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body.' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

export default app;
