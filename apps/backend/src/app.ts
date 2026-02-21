import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/test', (_req, res) => {
  res.json({ message: 'Backend working' })
})

export default app