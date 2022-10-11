import * as mongoose from 'mongoose' //req
// the subdocuments couldn't be separated into further files because circular imports would cause errors
// therefore, the playbook model is written in one single file 

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
})

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
})

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
})

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
})

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
})

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
})

export const featureSchema = new mongoose.Schema({
    parallel_processing: {
        type: Boolean
    },
    if_logic: {
        type: Boolean
    },
    while_logic: {
        type: Boolean
    },
    switch_logic: {
        type: Boolean
    },
    temporal_logic: {
        type: Boolean
    },
    data_markings: {
        type: Boolean
    },
    extensions: {
        type: Boolean
    }
})

export const signatureSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    spec_version: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    created_by: {
        type: String
    },
    created: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
        required: true
    },
    modified: {
        type: Date,
        required: true
    },
    revoked: {
        type: Boolean
    },
    signee: {
        type: String,
        required: true
    },
    valid_from: {
        type: Date
    },
    valid_until: {
        type: Date
    },
    related_to: {
        type: String,
        required: true
    },
    sha256: {
        type: String,
        required: true
    },
    algorithm: {
        type: String,
        required: true
    },
    public_keys: {
        type: [String]
    },
    cert_url: {
        type: String
    },
    thumbprint: {
        type: String
    },
    value: {
        type: String,
        required: true
    }
})

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
        type: Map,
        of: extensionSchema
    },
    contact: {
        type: contactSchema
    },
    location: {
    },
    gps: {
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
})

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

export const dataMarkingSchema = new mongoose.Schema({
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
    created_by: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
        required: true
    },
    modified: {
        type: Date,
        required: true
    },
    revoked: {
        type: Boolean
    },
    valid_from: {
        type: Date,
        default: () => Date.now(),
    },
    valid_until: {
        type: Date
    },
    labels: {
        type: [String]
    },
    external_references: {
        type: [externalReferencesSchema]
    },
    marking_extensions: {
        type: Map,
        of: extensionSchema
    },
    statement: {
        type: String
    },
    tlp_level: {
        type: String
    },
    iep_version: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    encrypt_in_transit: {
        type: String
    },
    permitted_actions: {
        type: String
    },
    attribution: {
        type: String
    },
    unmodified_resale: {
        type: String
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
        type: [externalReferencesSchema]
    },
    delay: {
        type: Number
    },
    timeout: {
        type: Number
    },
    step_variables: {
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
        type: Map,
        of: extensionSchema
    },
    commands: {
        type: [commandSchema]
    },
    target: {
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
        of: [String]
    }
})

// here the schema for the documents is defined for the database
export const playbookSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    spec_version: {
        type: String,
        required: true
    },
    id: {
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
    playbook_types: {
        type: [String],
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
        required: true
    },
    modified: {
        type: Date,
        default: () => Date.now(),
        required: true
    },
    revoked: {
        type: Boolean,
        default: () => false
    },
    valid_from: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    valid_until: {
        type: Date
    },
    derived_from: {
        type: [String]
    },
    priority: {
        type: Number
    },
    severity: {
        type: Number
    },
    impact: {
        type: Number
    },
    labels: {
        type: [String]
    },
    external_references: {
        type: [externalReferencesSchema]
    },
    features: {
        type: featureSchema
    },
    markings: {
        type: [String]
    },
    playbook_variables: {
        type: Map,
        of: variablesSchema
    },
    workflow_start: {
        type: String
    },
    workflow_exception: {
        type: String
    },
    workflow: {
        type: Map,
        of: workflowStepSchema
    },
    targets: {
        type: Map,
        of: targetSchema
    },
    extension_definitions: {
        type: Map,
        of: extensionSchema
    },
    data_marking_definitions: {
        type: Map,
        of: dataMarkingSchema
    },
    signatures: {
        type: [signatureSchema]
    }
})

module.exports = mongoose.model('Playbook', playbookSchema);