
import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"
import { bugService } from "./bug.service.js"

const TAG = "bug.middleware"

export async function requireCreator(req, res, next) {
    loggerService.debug(req.params?.bugId + " | " + req.body?._id)
    const bugId = req.params?.bugId || req.body?._id 
    
    const loggedinUser = await authService.getLoggedinUser(req)
    
    if (!loggedinUser) {
        return res.status(401).send(`Not authenticated`)
    }

    const bug = await bugService.getById(bugId)
    loggerService.debug(TAG, `${JSON.stringify(bug)}`)
    if (loggedinUser._id !== bug.creator._id && !loggedinUser.isAdmin) {
        loggerService.warn(TAG, `${loggedinUser.username} try to perform not your bug action`)
        return res.status(403).send(`Not authorized`)
    }
    
    req.bug = bug
    req.loggedinUser = loggedinUser

    next()
}