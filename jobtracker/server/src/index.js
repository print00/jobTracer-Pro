import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on http://localhost:${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
