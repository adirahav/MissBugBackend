import { authService } from "./auth.service.js"
import { loggerService } from "../../services/logger.service.js"

const TAG = "auth.middleware"

export async function requireAuth(req, res, next) {
    const loggedinUser = await authService.getLoggedinUser(req)
    
    if (!loggedinUser) {
        return res.status(401).send(`Not authenticated`)
    }
    
    req.loggedinUser = loggedinUser

    next()
}

export async function requireAdmin(req, res, next) {
    const loggedinUser = await authService.getLoggedinUser(req)
    
    if (!loggedinUser) {
        return res.status(401).send(`Not authenticated`)
    }

    if (!loggedinUser.isAdmin) {
        loggerService.warn(TAG, `${loggedinUser.username} try to perform an admin action`)
        return res.status(403).send(`Not authorized`)
    }
    
    req.loggedinUser = loggedinUser

    next()
}