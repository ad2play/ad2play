import axios from 'axios'

export default {
    // create a new csaf file
    async create(context, data) {

        try {
            const response = await axios.post(`${process.env.VUE_APP_BASE_API_URL}/api/csaf`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            context.commit('create', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while creating!');
        }
    },
    // update an existing csaf document
    async update(context, data) {

        try {
            const response = await axios.put(`${process.env.VUE_APP_BASE_API_URL}/api/csaf/${data._id}`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('update', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while updating!');
        }
    },
    // get a specific csaf document
    async get(context, data) {

        try {
            const response = await axios.get(`${process.env.VUE_APP_BASE_API_URL}/api/csaf/${data._id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('update', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while fetching data!');
        }
    },
    // delete a given document
    async delete(context, data) {

        try {
            const response = await axios.delete(`${process.env.VUE_APP_BASE_API_URL}/api/csaf/${data._id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('delete', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while deleting!');
        }
    },
    // get all csaf documents
    async fetchAll(context, payload) {

        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }

        try {
            const response = await axios.get(`${process.env.VUE_APP_BASE_API_URL}/api/csaf`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('setList', response.data);
            context.commit('setFetchTimestamp');
        } catch (error) {
            new Error(error.response.data.message || 'Error while fetching data!');
        }
    },
    async getByIdArray(context, arr) {
        try {
            let res = [];
            for (const item of arr) {
                const response = await axios.get(`${process.env.VUE_APP_BASE_API_URL}/api/csaf/${item}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                res.push(response.data);
            }
            context.commit('setArrList', res);
        } catch (error) {
            new Error(error.response.data.message || 'Fehler beim Laden!');
            context.commit('setArrList', []);
        }
    }
};