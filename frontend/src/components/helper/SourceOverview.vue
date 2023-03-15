// component that shows the user a datatable with the sources used in the backend -> transparancy of the system's functionality
<template>
    <SourceList :data="sources" :key="tableKey"></SourceList>
</template>

<script>
import SourceList from './SourceList.vue';

export default {
    components: {
        SourceList
    },
	data() {
		return {
            tableKey: 1
		}
	},
    computed: {
        sources() {
            return this.$store.getters['source/list'];
        }
    },
    methods: {
        async fetchData() {
            try{
                await this.$store.dispatch('source/fetchAll', {
                    forceRefresh: true
                });
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.tableKey += 1;
        this.fetchData();
    }	
}
</script>