import * as mongoose from 'mongoose'

export const sourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    last_fetch: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Source', sourceSchema);