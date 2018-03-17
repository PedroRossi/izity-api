import { Router } from 'express'
import { Call, User } from '../models'
import { VoicePIN } from '../middlewares'

const router = Router()

router.get('/', (req, res) => {
    Call.find()
        .populate('caller')
        .populate('callee')
        .then(calls => res.status(200).json(calls))
        .catch(err => res.status(500).json(err))
})

router.get('/:id', (req, res) => {
    Call.findById(req.params.id)
        .populate('caller')
        .populate('callee')
        .then(call => res.status(200).json(call))
        .catch(err => res.status(500).json(err))
})

router.post('/', (req, res) => {

})

export const CallRouter = router