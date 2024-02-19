import { loggerService } from "../../services/logger.service.js";
import Cryptr from "cryptr"
import bcrypt from "bcrypt"
import { userService } from "../user/user.service.js";

const TAG = "auth.service"
const cryptr = new Cryptr(process.env.SECRET1 || 'seceret-puk-1234') 

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup,
    getLoggedinUser,
    hashPassword
}

async function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

async function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch (err) {
        loggerService.error(TAG, `Invalid login token`, err)
    }
    return null
}

async function login(username, password) {
    try {
        const user = await userService.getByUsername(username)
        if (!user) {
            throw 'Unknown username'
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw 'Invalid username or password'
        }

        const miniUser =  {
            _id: user._id,
            fullname: user.fullname,
            score: user.score,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin
        }

        return miniUser
        
    } catch(err) {
        loggerService.error(TAG, `Had problems login user ${username}`, err)
        throw err
    }
}

async function signup({ username, password, fullname, score, imgUrl }) {
    
    try {
        loggerService.debug(TAG, `signup with username: ${username}, fullname: ${fullname}`)
    
        if (!username || !password || !fullname) {
            throw 'Missing required signup information'
        }

        const isUserExist = await userService.getByUsername(username)
        if (isUserExist) {
            throw 'Username already taken'
        }

        return userService.save({username, password: password, fullname, score, imgUrl })

    } catch(err) {
        loggerService.error(TAG, `Had problems signup ${username}`, err)
        throw err
    }
}

async function getLoggedinUser(req) {
    console.log(`req.coockies: `, req.cookies)
    const loggedinUser = await validateToken(req.cookies.loginToken)
    console.log(`loggedinUser: `, loggedinUser)
    return loggedinUser
}

async function hashPassword(password) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}
