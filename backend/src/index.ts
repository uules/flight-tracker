import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import redis from './config/redis';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const start = async () => {
  await redis.connect();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
