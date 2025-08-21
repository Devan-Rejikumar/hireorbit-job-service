import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jobRoutes from './routes/JobRoutes';

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.get('/health', (req, res) => {
  res.json({ message: 'Job Service is running!' });
});


app.use('/api/jobs', jobRoutes);

export default app;
