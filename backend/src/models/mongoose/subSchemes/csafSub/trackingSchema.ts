import mongoose from "mongoose"

export const engineSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    version: {
        type: String
    }
})

export const generatorSchema = new mongoose.Schema({
    date: {
        type: String
    },
    engine: {
        type: engineSchema,
        require: true
    }
})

export const revisionHistorySchema = new mongoose.Schema({
    date: {
        type: String,
        require: true
    },
    legacy_version: {
        type: String
    },
    number: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        require: true
    }
})

export const trackingSchema = new mongoose.Schema({
    aliases: {
        type: [String]
    },
    current_release_date: {
        type: String,
        require: true
    },
    generator: {
        type: generatorSchema
    },
    id: {
        type: String,
        require: true
    },
    initial_release_date: {
        type: String,
        require: true
    },
    revision_history: {
        type: [revisionHistorySchema],
        require: true
    },
    status: {
        type: String,
        require: true
    },
    version: {
        type: String,
        require: true
    }
})