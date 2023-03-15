// store module only for checking if the system is up and running by making simple http requests to the server
export default {
    namespaced: true,
    state() {
        return {
        };
    },
    mutations: {
    },
    getters: {
        createDictionary: () => (data) => {
            const json = JSON.parse(JSON.stringify(data));
            const ret = {};
            const idxs = [];
            for (const j of json) {
                if (!idxs.includes(j.index) && j.ret.key) {
                    idxs.push(j.index);
                    let key = j.ret.key;
                    let rest = j.ret;
                    delete rest.key;
                    ret[key] = rest;
                }
            }
            return ret
        },
        reverseDictionary: () => (json) => {
            const ret = [];
            for (const j in json) {
                const tmp = {};
                tmp['key'] = j;
                tmp['ret'] = json[j];
                ret.push(tmp);
            }
            return ret
        }
    },
    actions: {
    }
};