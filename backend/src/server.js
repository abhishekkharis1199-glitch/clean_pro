import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { authRoutes } from './routes/authRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { checkDatabase } from './config/database.js'

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use(errorHandler)

checkDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`CleanPro API listening on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  })
