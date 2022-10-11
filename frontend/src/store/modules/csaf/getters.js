export default {
    list(state) {
        return state.entities;
    },
    arrList(state) {
        return state.arrEnt;
    },

    getById: (state) => (id) => {
        return state.entities.find(e => e._id == id)
    },
    getRecentCreated(state) {
        return state.recentCreated;
    },

    notEmpty(state) {
        return state.entities && state.entities.length > 0;
    },
    shouldUpdate(state) {
        const lastFetch = state.lastFetch;
        if (!lastFetch) {
            return true;
        }
        const currentTimeStamp = new Date().getTime();
        return (currentTimeStamp - lastFetch) / 1000 > 60;
    }
};