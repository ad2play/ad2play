import mongoose from "mongoose";

export const publisherSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    contact_details: {
        type: String
    },
    issuing_authority: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    namespace: {
        type: String,
        required: true
    },
})