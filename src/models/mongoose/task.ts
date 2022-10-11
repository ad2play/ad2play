import * as mongoose from 'mongoose';

export const taskSchema = new mongoose.Schema({
    type: {
        type: String
    },
    description: {
        type: String
    },
    assigned_to: {
        type: String
    },
    manual_action_required: {
        type: Boolean
    },
    done: {
        type: Boolean
    },
    approved: {
        type: Boolean
    },
    created: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    modified: {
        type: Date
    },
    csaf_files: {
        _id: false,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'CSAF'
    },
    playbook: {
        _id: false,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Playbook'
    },
    entity_tags: {
        type: [String]
    },
    group_tags: {
        type: [String]
    }
})

module.exports = mongoose.model('Task', taskSchema);