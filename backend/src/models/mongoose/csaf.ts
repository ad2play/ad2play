import * as mongoose from 'mongoose'
import { trackingSchema } from './subSchemes/csafSub/trackingSchema';
import { distributionSchema } from './subSchemes/csafSub/distributionSchema';
import { publisherSchema } from './subSchemes/csafSub/publisherSchema';
import { aggregateSeveritySchema } from './subSchemes/csafSub/aggregateSeveritySchema';
import { productTreeSchema } from './subSchemes/csafSub/productTreeSchema';
import { vulnerabilitiesSchema, acknowledgementSchema, notesSchema, referencesSchema } from './subSchemes/csafSub/vulnerabilitiesSchema';

export const documentSchema = new mongoose.Schema({
    acknowledgements: {
        type: [acknowledgementSchema]
    },
    aggregate_severity: {
        type: [aggregateSeveritySchema]
    },
    category: {
        type: String,
        required: true
    },
    csaf_version: {
        type: String,
        required: true
    },
    distribution: {
        type: distributionSchema
    },
    lang: {
        type: String
    },
    notes: {
        type: [notesSchema]
    },
    publisher: {
        type: publisherSchema,
        required: true
    },
    references: {
        type: [referencesSchema]
    },
    source_lang: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    tracking: {
        type: trackingSchema,
        required: true
    }
})

// here the schema for the documents is defined for the database
export const csafSchema = new mongoose.Schema({
    document: {
        type: documentSchema,
        required: true
    },
    product_tree: {
        type: productTreeSchema
    },
    vulnerabilities: {
        type: [vulnerabilitiesSchema]
    }
})

module.exports = mongoose.model('CSAF', csafSchema);