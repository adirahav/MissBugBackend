import { loggerService } from '../../services/logger.service.js'
import { userService } from './user.service.js'

const TAG = "user.controller"

// list
export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch(err) {
        loggerService.error(TAG, `Couldn't get users`, err)
        res.status(400).send(`Couldn't get users`)
    }
}

// read
export async function getUser(req, res) {
    const { userId } = req.params
    
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch(err) {
        loggerService.error(TAG, `Couldn't get user`, err)
        res.status(400).send(`Couldn't get user`)
    }  
}

// create
export async function addUser(req, res) {
    const { _id, fullname, username, password, score } = req.body 
    const userToSave = { _id, fullname, username, password, score }

    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch(err) {
        loggerService.error(TAG, `Couldn't add user`, err)
        res.status(400).send(`Couldn't add user`)
    }  
}

// update
export async function updateUser(req, res) {
    const { _id, fullname, username, password, score } = req.body 
    const userToSave = { _id, fullname, username, password, score }

    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch(err) {
        loggerService.error(TAG, `Couldn't update user`, err)
        res.status(400).send(`Couldn't update user`)
    }  
}

// delete
export async function removeUser(req, res) {
    const { userId } = req.params

    try {
        await userService.remove(userId)
        res.send(`user ${userId} removed`)
    } catch(err) {
        loggerService.error(TAG, `Couldn't remove user`, err)
        res.status(400).send(`Couldn't remove user`)
    }   
}