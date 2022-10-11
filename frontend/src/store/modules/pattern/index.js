import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

// store module for accessing the pattern documents
export default {
    namespaced: true,
    state() {
        return {
            lastFetch: null,
            entities: [],
            recentCreated: null
        };
    },
    mutations,
    actions,
    getters
};
