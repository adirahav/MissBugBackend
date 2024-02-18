import { loggerService } from '../../services/logger.service.js'
import { authService } from './auth.service.js'

const TAG = "auth.controller"

export async function signup(req, res) {
    try {
        const credentials = req.body
        //loggerService.debug(`[${TAG}] credentials: ${credentials}`)  //never log passwords

        const account = await authService.signup(credentials)
        loggerService.info(TAG, `User signup: ${JSON.stringify(account)}`)
        
        const user = await login({body: {username: credentials.username, password: credentials.password}}, res)
        res.json(user)
    } catch(err) {
        loggerService.error(TAG, `Couldn't get user`, err)
        res.status(400).send(`Couldn't get user`)
        //res.status(err.code).send(`Couldn't get user: ${err}`)
    }
}

export async function login(req, res) {
    const { username, password } = req.body
        
    try {
        const user = await authService.login(username, password)
        loggerService.info(TAG, `User login: `, user)  

        const loginToken = await authService.getLoginToken(user)
        
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
    } catch(err) {
        loggerService.error(TAG, `Couldn't get user`, err)
        res.status(400).send(`Couldn't get user`)
    } 
}

export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        loggerService.error(TAG, `Failed to logout`, err)
        res.status(400).send({ err: 'Failed to logout' })
    }
}