import { Router } from 'express'
import { User } from '../models'
import { VoicePIN } from '../middlewares'

const router = Router()

router.get('/', (req, res) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json(err))
})

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
})

router.post('/', (req, res) => {
    let user = {}
    VoicePIN.createVoiceprint()
        .then(data => {
            user = new User({
                name: req.body.name,
                phone: req.body.phone,
                voiceprintId: data.voiceprintId
            })
            return user.save()
        })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(500).json(err))
})

router.put('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (req.body.name)
                user.name = req.body.name
            if (req.body.phone)
                user.phone = req.body.phone
            return user.save()
        })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
})

router.delete('/:id', (req, res) => {
    let voiceprintId = ''
    User.findById(req.params.id)
        .then(user => {
            voiceprintId = user.voiceprintId
            return user.remove()
        })
        .then(() => VoicePIN.removeVoiceprint(voiceprintId))
        .then(() => res.end())
        .catch(err => res.status(500).json(err))
})

router.delete('/:id/resetVoiceprint', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            return VoicePIN.resetVoiceprintEnrollment(user.voiceprintId)
        })
        .then(() => res.end())
        .catch(err => res.status(500).json(err))
})

export const UserRouter = router