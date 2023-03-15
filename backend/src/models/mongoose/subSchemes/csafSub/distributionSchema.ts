import mongoose from "mongoose"

export const tlpSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    url: {
        type: String
    }
})

export const distributionSchema = new mongoose.Schema({
    text: {
        type: String
    },
    tlp: {
        type: tlpSchema
    }
})