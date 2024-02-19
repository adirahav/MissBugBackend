import { loggerService } from "../services/logger.service.js"

const TAG = "log.middleware"

export async function logRoute(req, res, next) {
    const routePath = req.originalUrl
    loggerService.debug(TAG, `Calling route "${routePath}"`)
    next()
}