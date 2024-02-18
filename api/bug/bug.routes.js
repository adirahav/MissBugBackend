import express from 'express'
import { getBugs, getBug, addBug, updateBug, removeBug } from './bug.controller.js'
import { requireUser } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getBugs)                            // list
router.get('/:bugId', getBug)                       // read
router.post('/', requireUser, addBug)               // create
router.put('/', requireUser, updateBug)             // update
router.delete('/:bugId',  requireUser, removeBug)   // delete

export const bugRoutes = router