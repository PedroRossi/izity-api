import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { CallRouter, UserRouter } from './routes'

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/izity'

mongoose.connect(mongoUri)
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/calls', CallRouter)
app.use('/users', UserRouter)

app.all('*', (req, res) => {
    res.status(404).json({message: 'not found'})
})

app.listen(port, () => {
    console.log(`Listening on ${port}!`)
})