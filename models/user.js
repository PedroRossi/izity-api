import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    voiceprintId: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('User', userSchema)