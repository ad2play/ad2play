const uuid = require('uuidv5');
import { canonicalize } from 'json-canonicalize';

// store module for creating UUIDv5 identifiers for the CACAO standard
export default {
    namespaced: true,
    state() {
        return {
        };
    },
    mutations: {
    },
    getters: {
        uuidv5: () => (type, json) => {
            const privns = uuid('null', 'aa7caf3a-d55a-4e9a-b34e-056215fba56a', true);
            const privUUID = uuid(privns, canonicalize(json));
            return type + '--' + privUUID;
        }
    },
    actions: {
    }
};