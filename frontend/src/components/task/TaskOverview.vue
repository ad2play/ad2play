// component for displaying every task of the database in a datatable
<template>
    <TaskList :data="tasks" :deleteEnabled="true" @task-deleted="fetchData" :key="tableKey" :tableTitle="title"></TaskList>    
</template>

<script>
import TaskList from './TaskList.vue';

export default {
    components: {
        TaskList
    },
	data() {
		return {
            tableKey: 1,
            title: 'Task Overview'
		}
	},
    computed: {
        tasks() {
            return this.$store.getters['task/list'];
        }
    },
    methods: {
        async fetchData() {
            try{
                await this.$store.dispatch('task/fetchAll', {
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