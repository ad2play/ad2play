import mongoose from "mongoose";

export const acknowledgementSchema = new mongoose.Schema({
    names: {
        type: [String]
    },
    organization: {
        type: String
    },
    summary: {
        type: String
    },
    urls: {
        type: [String]
    }
})

export const referencesSchema = new mongoose.Schema({
    category: {
        type: String
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

export const notesSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    audience: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String
    }
})

export const cweSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

export const flagsSchema = new mongoose.Schema({
    date: {
        type: String
    },
    group_ids: {
        type: [String]
    },
    label: {
        type: String,
        required: true
    },
    product_ids: {
        type: [String]
    }
})

export const idsSchema = new mongoose.Schema({
    system_name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

export const involvementsSchema = new mongoose.Schema({
    date: {
        type: String
    },
    party: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    summary: {
        type: String
    }
})

export const productStatusSchema = new mongoose.Schema({
    first_affected: {
        type: [String]
    },
    first_fixed: {
        type: [String]
    },
    fixed: {
        type: [String]
    },
    known_affected: {
        type: [String]
    },
    known_not_affected: {
        type: [String]
    },
    last_affected: {
        type: [String]
    },
    recommended: {
        type: [String]
    },
    under_investigation: {
        type: [String]
    }
})

export const restartRequiredSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    details: {
        type: String
    }
})

export const remediationsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    details: {
        type: String,
        required: true
    },
    entitlements: {
        type: [String]
    },
    group_ids: {
        type: [String]
    },
    product_ids: {
        type: [String]
    },
    restart_required: {
        type: restartRequiredSchema
    },
    url: {
        type: String
    }
})

export const cvssSchema = new mongoose.Schema({
    version: {
        type: String
    },
    baseScore: {
        type: String
    },
    baseSeverity: {
        type: String
    },
    vectorString: {
        type: String
    }
})

export const scoresSchema = new mongoose.Schema({
    cvss_v2: {
        type: cvssSchema
    },
    cvss_v3: {
        type: cvssSchema
    },
    products: {
        type: [String],
        required: true
    }
})

export const threatsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    details: {
        type: String,
        required: true
    },
    group_ids: {
        type: [String]
    },
    product_ids: {
        type: [String]
    }
})

export const vulnerabilitiesSchema = new mongoose.Schema({
    acknowledgements: {
        type: [acknowledgementSchema]
    },
    cve: {
        type: String
    },
    cwe: {
        type: cweSchema
    },
    discovery_date: {
        type: String
    },
    flags: {
        type: [flagsSchema]
    },
    ids: {
        type: [idsSchema]
    },
    involvements: {
        type: [involvementsSchema]
    },
    notes: {
        type: [notesSchema]
    },
    product_status: {
        type: productStatusSchema
    },
    references: {
        type: [referencesSchema]
    },
    release_date: {
        type: String
    },
    remediations: {
        type: [remediationsSchema]
    },
    scores: {
        type: [scoresSchema]
    },
    threats: {
        type: [threatsSchema]
    },
    title: {
        type: String
    }
})