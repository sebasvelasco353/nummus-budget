import express from 'express';
import pg from 'pg';
import cors from 'cors'
import cookieParser from 'cookie-parser'

const { Pool } = pg
const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// PostgreSQL connection pool — DATABASE_URL is injected by Docker Compose
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
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
