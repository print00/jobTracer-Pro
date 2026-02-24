import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import appRoutes from './routes/appRoutes.js';
import { env } from './config/env.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');
const allowedOrigins = env.clientUrl
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true
  })
);

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'jobtrackr-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
