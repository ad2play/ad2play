// component that consists of a datatable in which all open tasks are shown
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
            title: 'Open Tasks'
		}
	},
    computed: {
        tasks() { // computed property for providing the tasks that are not approved yet
            let tasks = this.$store.getters['task/list'];
            let ret = [];
            ret = tasks.filter(function (el) {
                return !el.approved;
            });
            return ret;
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