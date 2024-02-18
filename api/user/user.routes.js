import express from 'express'
import { getUsers, getUser, addUser, updateUser, removeUser } from './user.controller.js'
import { requireAdmin } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getUsers)                               // list
router.get('/:userId', getUser)                         // read
router.post('/', addUser)                               // create
router.put('/', requireAdmin, updateUser)               // update
router.delete('/:userId', requireAdmin, removeUser)     // delete

export const userRoutes = router