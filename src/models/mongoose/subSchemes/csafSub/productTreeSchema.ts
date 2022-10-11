import mongoose from "mongoose";

export const fileHashesSchema = new mongoose.Schema({
    algorithm: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

export const hashesSchema = new mongoose.Schema({
    file_hashes: {
        type: fileHashesSchema,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
})

export const xGenericUrisSchema = new mongoose.Schema({
    namespace: {
        type: String,
        required: true
    },
    uri: {
        type: String,
        required: true
    }
})

export const productIdentificationHelperSchema = new mongoose.Schema({
    cpe: {
        type: String
    },
    hashes: {
        type: [hashesSchema]
    },
    model_numbers: {
        type: [String]
    },
    purl: {
        type: String
    },
    sbom_urls: {
        type: [String]
    },
    serial_numbers: {
        type: [String]
    },
    skus: {
        type: [String]
    },
    x_generic_uris: {
        type: [xGenericUrisSchema]
    }
})

export const fullProductNamesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    product_identification_helper: {
        type: productIdentificationHelperSchema
    }
})

export const branchesSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    product: {
        type: fullProductNamesSchema
    }
})

branchesSchema.add({
    branches: [branchesSchema],
});

export const productGroupsSchema = new mongoose.Schema({
    group_id: {
        type: String,
        required: true
    },
    product_ids: {
        type: [String],
        required: true
    },
    summary: {
        type: String
    }
})

export const relationshipsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    full_product_name: {
        type: String,
        required: true
    },
    product_references: {
        type: String,
        required: true
    },
    relates_to_product_reference: {
        type: String,
        required: true
    }
})

export const productTreeSchema = new mongoose.Schema({
    branches: {
        type: [branchesSchema]
    },
    full_product_names: {
        type: [fullProductNamesSchema]
    },
    product_groups: {
        type: [productGroupsSchema]
    },
    relationships: {
        type: [relationshipsSchema]
    }
})