
import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"

const TAG = "user.middleware"

export async function requireCreator(req, res, next) {
    const { userId } = req.params
    const loggedinUser = await authService.getLoggedinUser(req)
    
    if (!loggedinUser) {
        return res.status(401).send(`Not authenticated`)
    }
    
    if (loggedinUser._id !== userId && !loggedinUser.isAdmin) {
        loggerService.warn(TAG, `${loggedinUser.username} try to perform not your user action`)
        return res.status(403).send(`Not authorized`)
    }
    
    req.loggedinUser = loggedinUser

    next()
}