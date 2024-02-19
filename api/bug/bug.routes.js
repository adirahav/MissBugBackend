import express from 'express'
import { getBugs, getBug, addBug, updateBug, removeBug } from './bug.controller.js'
import { requireAuth } from '../auth/auth.middleware.js'
import { requireCreator } from './bug.middleware.js'
import { logRoute } from '../../middleware/log.middleware.js'

const router = express.Router()

router.get('/', logRoute, getBugs)                      // list
router.get('/:bugId', getBug)                           // read
router.post('/', requireAuth, addBug)                   // create
router.put('/', requireCreator, updateBug)              // update
router.delete('/:bugId',  requireCreator, removeBug)    // delete

export const bugRoutes = router