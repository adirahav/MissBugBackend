import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import dotenv from 'dotenv'
import { loggerService } from './services/logger.service.js'

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

// ======================
// configurations
// ======================

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))


// ======================
// end points
// ======================
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

// ======================
// fronend end point
// ======================
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

dotenv.config()
const PORT = process.env.PORT || 5175 
app.listen(PORT, () => {
    loggerService.info(`Server ready at port ${PORT}`)
})

