import { Router } from 'express'
import { Readable } from 'stream'
import multer from 'multer'
import { Call, User } from '../models'
import { Watson } from '../middlewares'

const router = Router()

router.get('/', (req, res) => {
    Call.find()
        .select('-audio')
        .populate('caller')
        .populate('callee')
        .then(calls => res.status(200).json(calls))
        .catch(err => res.status(500).json(err))
})

router.get('/:id', (req, res) => {
    Call.findById(req.params.id)
        .select('-audio')
        .populate('caller')
        .populate('callee')
        .then(call => res.status(200).json(call))
        .catch(err => res.status(500).json(err))
})

router.get('/:id/audio', (req, res) => {
    Call.findById(req.params.id)
        .then(call => {
            const readable = new Readable()
            readable._read = () => {} // _read is required but you can noop it
            readable.push(call.audio)
            readable.push(null)
            res.setHeader('Content-Type', 'audio/wav')
            res.setHeader('Content-Length', call.audio.byteLength)
            readable.pipe(res)
        })
        .catch(err => res.status(500).json(err))
})

router.post('/', (req, res) => {
    const storage = multer.memoryStorage()
    const uploader = multer({
        storage: storage,
        fileSize: 1024*1024,
        fileFilter: (req, file, cb) => {
            cb(null, file.mimetype === "audio/wave" || file.mimetype === "audio/wav")
        }
    }).single('record')
    uploader(req, res, (err) => {
        const record = req.file.buffer
        Watson.recognize(record)
            .then(data => {
                let text = ''
                data.results.forEach(r => {
                    r.alternatives.forEach(obj => {
                        text += obj.transcript
                    })
                })
                const call = new Call({
                    authorized: req.body.authorized,
                    audio: record,
                    text: text,
                    start: req.body.start,
                    end: req.body.end
                })
                return call.save()
            })
            .then(call => {
                let obj = call.toObject()
                delete obj["audio"]
                res.status(201).json(obj)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    })
})

export const CallRouter = router