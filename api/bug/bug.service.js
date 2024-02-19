import { loggerService } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";

export const bugService = {
    query,
    getById,
    remove,
    save
}

const TAG = "bug.service"
var PAGE_SIZE = 2

var bugs = utilService.readJsonFile('./data/bugs.json')

async function query(sort, filterBy) {
    
    try {
        loggerService.debug("filterBy: " + JSON.stringify(filterBy))
        var filteredBugs = bugs.filter(bug => {
            const matchesSeverity = !filterBy.severity 
                || +filterBy.severity === -1 
                || +bug.severity === +filterBy.severity
            
            const matchesMinSeverity = !filterBy.minSeverity 
                || +filterBy.minSeverity === -1 
                || +filterBy.minSeverity >= +bug.severity
            
            const matchesText = !filterBy.txt 
                || bug.title.toLowerCase().includes(filterBy.txt.toLowerCase()) 
                || (bug.description && bug.description.toLowerCase().includes(filterBy.txt.toLowerCase()))
                
            const matchesLabel = !filterBy.labels 
                || filterBy.labels.length === 0  
                || filterBy.labels.some((label) =>
                  bug.labels?.some((bugLabel) => bugLabel === label)
                )
                
            const matchesCreator = !filterBy.creator 
                || filterBy.creator === '' 
                || bug.creator._id === filterBy.creator
            
            return matchesSeverity && matchesMinSeverity && matchesText && matchesLabel && matchesCreator
        }) 
        loggerService.debug(filteredBugs.length)
        
        if (sort !== null && sort.sortBy !== '') {
            filteredBugs = filteredBugs.sort((a, b) => {
                if (typeof a[sort.sortBy] === 'string') {
                    return a[sort.sortBy].localeCompare(b[sort.sortBy]) * sort.sortDir
                } else {
                    return (a[sort.sortBy] - b[sort.sortBy]) * sort.sortDir         
                }
            })
        }
        
        let bugsToReturn = [...filteredBugs] 
        if (filterBy.pageIdx && filterBy.pageIdx !== '') {
            const startIdx = (+filterBy.pageIdx - 1) * PAGE_SIZE
            const endIdx = startIdx + PAGE_SIZE
            bugsToReturn = bugsToReturn.slice(startIdx, endIdx)
        }
        
        const paging = filterBy.pageIdx && filterBy.pageIdx !== '' ? {
            length: filteredBugs.length,
            maxPages: Math.ceil(filteredBugs.length / PAGE_SIZE)
        } : null
        
        return {
            paging,
            list: bugsToReturn
        }
    } catch(err) {
        loggerService.error(TAG, `Had problems getting bugs`, err)
        throw `Had problems getting bugs`
    }
    
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        return bug
    } catch(err) {
        loggerService.error(TAG, `Had problems getting bug ${bugId}`, err)
        throw `Had problems getting bug ${bugId}`
    }
}

async function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) {
        throw 'Bad Id'
    }

    const bug = bugs[idx]
    if (!loggedinUser.isAdmin && bug.creator?._id !== loggedinUser._id) {
        throw { msg: 'Not your bug', code: 403 }
    }

    bugs.splice(idx, 1)
    
    try {
        await utilService.saveToFile(bugs, './data/bugs.json')
    } catch(err) {
        loggerService.error(TAG, `Had problems removing bug ${bugId}`, err)
        throw `Had problems removing bug ${bugId}`
    }

    return `Bug ${bugId} removed`
}

async function save(bugToSave, loggedinUser) {
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) {
                throw 'Bad Id'
            }

            const bug = bugs[idx]
            
            if (!loggedinUser.isAdmin && bug.creator?._id !== loggedinUser._id) {
                throw { msg: 'Not your bug', code: 403 }
            }
            
            //bugs.splice(idx, 1, {...bug, ...bugToSave})
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = utilService.makeId()
            bugToSave.createdAt = Date.now()
            bugToSave.creator = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
    
            bugs.push(bugToSave)
        }

        await utilService.saveToFile(bugs, './data/bugs.json')
    } catch(err) {
        loggerService.error(TAG, `Had problems saving bug ${bugToSave._id}`, err)
        throw `Had problems saving bug ${bugToSave._id}`
    }

    return bugToSave
}


