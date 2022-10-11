import axios from 'axios'

export default {
    // create a pattern
    async create(context, data) {

        try {
            const response = await axios.post(`${process.env.VUE_APP_BASE_API_URL}/api/pattern`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('create', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while creating!');
        }
    },
    // alter an exisiting pattern
    async update(context, data) {

        try {
            const response = await axios.put(`${process.env.VUE_APP_BASE_API_URL}/api/pattern/${data._id}`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('update', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while updating!');
        }
    },
    // get a specific pattern
    async get(context, data) {

        try {
            const response = await axios.get(`${process.env.VUE_APP_BASE_API_URL}/api/pattern/${data._id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('update', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while fetching data!');
        }
    },
    // delete a given pattern
    async delete(context, data) {

        try {
            const response = await axios.delete(`${process.env.VUE_APP_BASE_API_URL}/api/pattern/${data._id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('delete', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while deleting!');
        }
    },
    // retrieve all patterns
    async fetchAll(context, payload) {

        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }

        try {
            const response = await axios.get(`${process.env.VUE_APP_BASE_API_URL}/api/pattern`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('setList', response.data);
            context.commit('setFetchTimestamp');
        } catch (error) {
            new Error(error.response.data.message || 'Error while fetching data!');
        }
    }
};