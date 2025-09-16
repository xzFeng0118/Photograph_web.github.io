// ES Module 版本
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.mjs';
import imageRoutes from './routes/images.mjs';
import { initDb } from './db.mjs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Initialize local mock DB if not in Cloudflare Worker environment
if (typeof globalThis.env === 'undefined' || !globalThis.env.DB) {
  initDb();
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});