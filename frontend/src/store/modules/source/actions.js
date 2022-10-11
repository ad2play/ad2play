import axios from 'axios'

export default {
    // get all source documents from the backend
    async fetchAll(context, payload) {

        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }

        try {
            const response = await axios.get(`${process.env.VUE_APP_BASE_API_URL}/api/source`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            context.commit('setList', response.data);
        } catch (error) {
            new Error(error.response.data.message || 'Error while fetching data!');
        }
    }
};