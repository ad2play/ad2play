import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

// store module for retreiving the twin data from the backend
export default {
    namespaced: true,
    state() {
        return {
            entities: []
        };
    },
    mutations,
    actions,
    getters
};
