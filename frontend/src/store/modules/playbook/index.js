import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

// store module for accessing the playbook documents
export default {
    namespaced: true,
    state() {
        return {
            lastFetch: null,
            entities: [],
            arrEnt: [],
            recentCreated: null
        };
    },
    mutations,
    actions,
    getters
};
