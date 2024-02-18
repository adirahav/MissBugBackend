import { loggerService } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save
}

const TAG = "user.service"
var users = utilService.readJsonFile('./data/users.json')

async function query() {
    
    try {
        return users
    } catch(err) {
        loggerService.error(TAG, `Had problems getting users`, err)
        throw `Had problems getting users`
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        return user
    } catch(err) {
        loggerService.error(TAG, `Had problems getting user`, err)
        throw `Had problems getting user`
    }
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        return user
    } catch(err) {
        loggerService.error(TAG, `Had problems getting user ${username}`, err)
        throw `Had problems getting user ${username}`
    }
}

async function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) {
        throw 'Bad Id'
    }

    users.splice(idx, 1)
    
    try {
        await utilService.saveToFile(users, './data/users.json')
    } catch(err) {
        loggerService.error(TAG, `Had problems removing user ${userId}`, err)
        throw `Had problems removing user ${userId}`
    }

    return `User ${userId} removed`
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) {
                throw 'Bad Id'
            }

            users.splice(idx, 1, userToSave)
        } else {
            userToSave._id = utilService.makeId()
            userToSave.createdAt = Date.now()
            userToSave.isAdmin = false
            if (!userToSave.imgURL) {
                userToSave.imgURL = "https://res.cloudinary.com/dn4zdrszh/image/upload/v1708020687/missing-avatar_sowwel.jpg"
            }

            users.push(userToSave)
        }

        await utilService.saveToFile(users, './data/users.json')
    } catch(err) {
        loggerService.error(TAG, `Had problems saving user ${userToSave._id}`, err)
        throw `Had problems saving user ${userToSave._id}`
    }

    return userToSave
}


