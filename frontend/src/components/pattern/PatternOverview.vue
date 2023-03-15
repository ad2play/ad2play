// component for giving an overview over all existing patterns by displaying them in a datatable
<template>
    <div class="card">
        <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">     
            <span class="p-input-icon-right">
                <Button @click="$router.push({ name: 'createPattern' });">Add Pattern</Button>
            </span>
        </div>
    </div>

    <PatternList :data="pattern" :deleteEnabled="true" @pattern-deleted="fetchData" :key="tableKey" :tableTitle="title"></PatternList>    

</template>

<script>
import PatternList from './PatternList.vue';

export default {
    components: {
        PatternList
    },
	data() {
		return {
            tableKey: 1,
            title: 'Pattern Overview'
		}
	},
    computed: {
        pattern() {
            return this.$store.getters['pattern/list'];
        }
    },
    methods: {
        async fetchData() {
            try{
                await this.$store.dispatch('pattern/fetchAll', {
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