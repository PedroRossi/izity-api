import mongoose, { Schema } from 'mongoose'

const callSchema = new Schema({
    authorized: {
        type: Boolean,
        required: true
    },
    audio: {
        type: Buffer,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }
})

export const Call = mongoose.model('Call', callSchema)