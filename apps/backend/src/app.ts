// import express from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'

// const app = express()

// app.use(cors({
//   origin: true,
//   credentials: true
// }))

// app.use(express.json())
// app.use(cookieParser())

// // Health check
// app.get('/health', (_req, res) => {
//   res.json({ status: 'ok' })
// })

// app.get('/api/test', (_req, res) => {
//   res.json({ message: 'Backend working' })
// })

// export default app

import express from 'express'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// PostgreSQL connection pool — DATABASE_URL is injected by Docker Compose
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', db: err.message })
  }
})

app.listen(port, () => {
  console.log(`Backend listening on port ${port} [${process.env.NODE_ENV}]`)
})
