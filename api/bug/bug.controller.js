import { loggerService } from '../../services/logger.service.js'
import { bugService } from './bug.service.js'

const TAG = "bug.controller"

// list
export async function getBugs(req, res) {
    const { txt, severity, minSeverity, labels, creator, pageIdx, sortBy, sortDir } = req.query
    const filterBy = { 
        txt: txt || '', 
        severity: severity || -1,
        minSeverity: minSeverity || -1,
        labels: labels && labels.trim() !== "" ? labels.split(',').map(label => label.trim()) : [],
        creator: creator || '', 
        pageIdx: pageIdx || '' 
    }
    loggerService.info(TAG, filterBy)

    const sort = { 
        sortBy: sortBy || '', 
        sortDir: sortDir || '1', // 1: asc | -1: description
    }
    
    try {
        const bugs = await bugService.query(sort, filterBy)
        res.send(bugs)
    } catch(err) {
        loggerService.error(TAG, `Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
    }
}

// read
export async function getBug(req, res) {
    const { bugId } = req.params
    
    try {

        const { visitedBugs = [] } = req.cookies

        const isBugWasVisited = visitedBugs.some(visitedBug => visitedBug === bugId)
        
        if (visitedBugs.length >= 3 && !isBugWasVisited) {
            res.status(401).send(`Wait for a bit`)
            return 
        }
        
        if (!isBugWasVisited) {
            visitedBugs.push(bugId)
        }


        const bug = await bugService.getById(bugId)

        if (bug) {
            res.cookie("visitedBugs", visitedBugs, { maxAge: 1000 * 7, sameSite: 'None', secure: true })
            loggerService.info(TAG, `User visited at the following bugs: ${JSON.stringify(visitedBugs)}`)
            res.send(bug)
        }
        else {
            res.status(400).send(`Couldn't get bug`) 
        }
        
    } catch(err) {
        loggerService.error(TAG, `Couldn't get bug`, err)
        res.status(400).send(`Couldn't get bug`)
    }  
}

// create
export async function addBug(req, res) {
    const { _id, title, description, severity, labels } = req.body 
    const bugToSave = { _id, title, description, severity, labels }

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch(err) {
        loggerService.error(TAG, `Couldn't add bug`, err)
        res.status(400).send(`Couldn't add bug`)
    }  
}

// update
export async function updateBug(req, res) {
    const { _id, title, description, severity, labels, creator } = req.body 
    const bugToSave = { _id, title, description, severity, labels, creator }
    
    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch(err) {
        loggerService.error(TAG, `Couldn't update bug`, err)
        res.status(400).send(`Couldn't update bug`)
    }  
}

// delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        await bugService.remove(bugId, req.loggedinUser)
        res.send(`bug ${bugId} removed`)
    } catch(err) {
        loggerService.error(TAG, `Couldn't remove bug`, err)
        res.status(400).send(`Couldn't remove bug`)
    }   
}