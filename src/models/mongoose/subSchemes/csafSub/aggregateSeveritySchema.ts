import mongoose from "mongoose";

export const aggregateSeveritySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    namespace: {
        type: String
    }
})