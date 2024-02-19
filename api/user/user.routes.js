import express from 'express'
import { getUsers, getUser, addUser, updateUser, removeUser } from './user.controller.js'
import { requireAdmin, requireAuth } from '../auth/auth.middleware.js'
import { requireCreator } from './user.middleware.js'

const router = express.Router()

router.get('/', /*requireAuth,*/ getUsers)                  // list
router.get('/:userId', requireCreator, getUser)         // read
router.post('/', requireAdmin, addUser)                 // create
router.put('/', requireAdmin, updateUser)               // update
router.delete('/:userId', requireAdmin, removeUser)     // delete

export const userRoutes = router