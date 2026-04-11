import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth_route';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Auth routes
app.use('/api/auth', authRouter);

// PostgreSQL connection pool — DATABASE_URL is injected by Docker Compose
const db = drizzle(process.env.DATABASE_URL!);

app.get('/api/health', async (_req, res) => {
  try {
    const _ = await db.select();
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ status: 'error', db: errorMessage })
  }
})

app.listen(port, () => {
  console.log(`Backend listening on port ${port} [${process.env.NODE_ENV}]`)
})

export default app;
