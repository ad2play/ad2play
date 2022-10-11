import * as mongoose from 'mongoose';
// same reason like the playbook model this model is written in one single file to avoid errors

export const civicLocationSchema = new mongoose.Schema({
    description: {
        type: String
    },
    building_details: {
        type: String
    },
    network_details: {
        type: String
    },
    region: {
        type: String
    },
    country: {
        type: String
    },
    administrative_area: {
        type: String
    },
    city: {
        type: String
    },
    street_address: {
        type: String
    },
    postal_code: {
        type: String
    }
}, { _id: false })

export const gpsLocationSchema = new mongoose.Schema({
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    precision: {
        type: String
    }
}, { _id: false })

export const commandSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    command: {
        type: String
    },
    command_b64: {
        type: String
    },
    version: {
        type: String
    }
}, { _id: false })

export const contactSchema = new mongoose.Schema({
    email: {
        type: String
    },
    phone: {
        type: Map,
        of: String
    },
    contact_details: {
        type: String
    }
}, { _id: false })

export const extensionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    created_by: {
        type: String,
        required: true
    },
    schema: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    }
}, { _id: false })

export const externalReferencesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    source: {
        type: String
    },
    url: {
        type: String
    },
    external_id: {
        type: String
    },
    reference_id: {
        type: String
    }
}, { _id: false })

export const targetSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    target_extensions: {
        _id: false,
        type: Map,
        of: extensionSchema
    },
    contact: {
        _id: false,
        type: contactSchema
    },
    location: {
        _id: false,
        type: civicLocationSchema
    },
    gps: {
        _id: false,
        type: gpsLocationSchema
    },
    logical: {
        type: [String]
    },
    http_url: {
        type: String
    },
    http_auth_type: {
        type: String
    },
    user_id: {
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
    oauth_header: {
        type: String
    },
    address: {
        type: String
    },
    port: {
        type: String
    },
    username: {
        type: String
    },
    private_key: {
        type: String
    },
    category: {
        type: [String]
    },
    executor_type: {
        type: String
    },
    agent_type: {
        type: String
    }
}, { _id: false })

targetSchema.add({
    executor: targetSchema,
    subject: targetSchema
});

export const variablesSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    value: {
        type: String
    },
    constant: {
        type: Boolean
    },
    external: {
        type: Boolean
    }
})

export const workflowStepSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    external_references: {
        _id: false,
        type: [externalReferencesSchema]
    },
    delay: {
        type: Number
    },
    timeout: {
        type: Number
    },
    step_variables: {
        _id: false,
        type: Map,
        of: variablesSchema
    },
    owner: {
        type: String
    },
    on_completion: {
        type: String
    },
    on_success: {
        type: String
    },
    on_failure: {
        type: String
    },
    step_extensions: {
        _id: false,
        type: Map,
        of: extensionSchema
    },
    commands: {
        _id: false,
        type: [commandSchema]
    },
    target: {
        _id: false,
        type: targetSchema
    },
    target_ids: {
        type: [String]
    },
    in_args: {
        type: [String]
    },
    out_args: {
        type: [String]
    },
    playbook_id: {
        type: String
    },
    next_steps: {
        type: [String]
    },
    condition: {
        type: String
    },
    on_true: {
        type: [String]
    },
    on_false: {
        type: [String]
    },
    switch: {
        type: String
    },
    cases: {
        type: Map,
        of: String
    }
}, { _id: false })

export const patternSchema = new mongoose.Schema({
    matching_terms: {
        type: [[String]],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    workflow_step: {
        _id: false,
        type: workflowStepSchema,
        required: true
    }
})

module.exports = mongoose.model('Pattern', patternSchema);