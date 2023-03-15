export default {
    create(state, payload) {
        state.entities.push(payload);
        state.recentCreated = payload;
    },
    update(state, payload) {
        const index = state.entities.findIndex((element) => element._id == payload._id);
        if (index == -1) {
            state.entities.push(payload);
        } else {
            state.entities[index] = payload;
        }
    },
    delete(state, payload) {
        const index = state.entities.findIndex((element) => element._id == payload._id);
        state.entities.splice(index, 1);
    },
    setList(state, payload) {
        state.entities = payload;
    },
    setFetchTimestamp(state) {
        state.lastFetch = new Date().getTime();
    }
};