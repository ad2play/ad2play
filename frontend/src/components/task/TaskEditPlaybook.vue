// component for editing an existing playbook of a task
<template>
    <div class="card">
        <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">     
            <span class="p-input-icon-right">
                <Button @click="$router.push({ name: 'singletaskview', params: { id: taskId }});">Back</Button>
            </span>
        </div>
    </div>

<!-- task information overview -->
	<div class="card" v-if="infoVisible">
        <Panel header="Task Information" :toggleable="true">
            <p>ID: <strong>{{task._id}}</strong></p>
			<p>Type: <strong>{{task.type}}</strong></p>
            <p>Description: <strong>{{task.description}}</strong></p>
            <p>Assigned To: <strong>{{task.assigned_to}}</strong></p>
            <p>Created: <strong>{{(task.created != null) ? new Date(task.created).toLocaleDateString("locale") : ''}}</strong></p>
            <p>Modified: <strong>{{(task.modified != null) ? new Date(task.modified).toLocaleDateString("locale") : ''}}</strong></p>
            <p>Manual: <strong>{{task.manual_action_required}}</strong></p>
            <p>Done: <strong>{{task.done}}</strong></p>
            <p>Approved: <strong>{{task.approved}}</strong></p>
            <p>CSAF: <strong>{{task.csaf_files}}</strong></p>
            <p>Playbook: <strong>{{task.playbook}}</strong></p>
        </Panel>
    </div>

    <div class="p-grid button-demo">
        <!-- CSAF presentation left -->
        <div class="p-col-12 p-md-6">
            <div class="card" v-if="csafsTask.length !== 0">
                <ScrollPanel style="width: 100%; height: 850px">
                    <div v-for="csaf in csafsTask" :key="csaf._id">
                        <CSAFDocument :id="csaf._id"></CSAFDocument>
                    </div>
                </ScrollPanel>
            </div>
        </div>

        
        <div class="p-col-12 p-md-6">
            <!-- Playbook configurator (edit mode) right -->
            <div class="card">
                <ScrollPanel style="width: 100%; height: 850px">
                    <div>
                        <PlaybookConfigurator :editId="id" @playbook-created="updatePlaybook"></PlaybookConfigurator>
                    </div>
                </ScrollPanel>
            </div>
        </div>
    </div>
</template>

<script>
import CSAFDocument from '../csaf/CSAFDocument.vue';
import PlaybookConfigurator from '../playbook/PlaybookConfigurator.vue';

export default {
    props: ['id', 'taskId'],
    components: {
        CSAFDocument,
        PlaybookConfigurator
    },
	data() {
		return {
            infoVisible: false,
            task: null
		}
	},
    computed: {
        csafsTask() {
            return this.$store.getters['csaf/arrList'];
        }
    },
    methods: {
        async fetchData() {
            try {

                await this.$store.dispatch('task/get', {_id: this.taskId});
                this.task = this.$store.getters['task/getById'](this.taskId);

                if (this.task) {
                    await this.$store.dispatch('csaf/getByIdArray', this.task.csaf_files);
                }
                
                this.infoVisible = true
            } catch (error) {
                console.log(error);
            }
        },
        async updatePlaybook(data) { // method for updating the playbook when the event is emitted by the configurator
            try {
                await this.$store.dispatch('playbook/update', {...data, _id: this.id});

                const taskToUpdate = this.task;                
                taskToUpdate.modified = new Date().toISOString();
                await this.$store.dispatch('task/update', taskToUpdate);


                this.$router.push({ name: 'singletaskview', params: { id: this.taskId }}).then(() => {
                        this.$toast.add({ severity: 'success', summary: 'Playbook updated!', life: 2000 });
                });
            }catch(error) {
                this.$toast.add({severity:'error', summary: 'Error while updating playbook!', life: 2000});
            }
        }
    },
    created() {
        this.fetchData();
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
    }	
}
</script>