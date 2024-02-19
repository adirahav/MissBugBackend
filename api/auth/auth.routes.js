import express from 'express'
import { signup, login, logout } from './auth.controller.js'
import { requireAuth } from './auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)                
router.post('/login', login)                
router.post('/logout', requireAuth, logout)                

export const authRoutes = router