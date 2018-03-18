import { Router } from 'express'
import { User } from '../models'
import { VoicePIN } from '../middlewares'
import multer from 'multer'

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

router.post('/:id/train', (req, res) => {
    const storage = multer.memoryStorage()
    const uploader = multer({
        storage: storage,
        fileSize: 1024*1024,
        fileFilter: (req, file, cb) => {
            cb(null, file.mimetype === "audio/wave" || file.mimetype === "audio/wav")
        }
    }).single('record')
    uploader(req, res, (err) => {
        if (err) {
            res.status(500).json(err)
            return
        }
        let user = {}
        let trainResponse = {}
        User.findById(req.params.id)
            .then(data => {
                user = data
                const record = req.file.buffer
                return VoicePIN.trainVoice(user.voiceprintId, record)
            })
            .then(data => {
                trainResponse = data
                user.trained = data.trained
                return user.save()
            })
            .then(() => res.status(200).json(trainResponse))
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    })
})

router.post('/:id/verify', (req, res) => {
    const storage = multer.memoryStorage()
    const uploader = multer({
        storage: storage,
        fileSize: 1024*1024,
        fileFilter: (req, file, cb) => {
            cb(null, file.mimetype === "audio/wave" || file.mimetype === "audio/wav")
        }
    }).single('record')
    uploader(req, res, (err) => {
        if (err) {
            res.status(500).json(err)
            return
        }
        let user = {}
        let trainResponse = {}
        User.findById(req.params.id)
            .then(data => {
                user = data
                const record = req.file.buffer
                return VoicePIN.verifyVoice(user.voiceprintId, record)
            })
            .then(data => res.status(200).json(data))
            .catch(err => res.status(500).json(err))
    })
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