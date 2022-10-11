// component for generating a detail page for a single task
<template>
<!-- possible actions for the user to interact with the task object -->
    <div class="card">
        <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">     
            <span class="p-input-icon-right">
                <Button @click="$router.push({ name: 'taskoverview'});">Back</Button>
            </span>

            <span class="p-input-icon-right" v-if="editable && !task.approved">
                <Button class="p-button-success" @click="approveTask">Approve Task</Button>
            </span>

            <span class="p-input-icon-right" v-if="editable && task.playbook.length === 0">
                <Button class="p-button-warning" @click="createPlaybook">Create Playbook</Button>
            </span>

            <span class="p-input-icon-right" v-if="editable && task.playbook.length > 0">
                <Button class="p-button-warning" @click="editPlaybook">Edit Playbook</Button>
            </span>
        </div>
    </div>

<!-- presentation of the general task information -->
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
            <p>Entity Tags: <strong>{{task.entity_tags.toString()}}</strong></p>
            <p>Group Tags: <strong>{{task.group_tags.toString()}}</strong></p>
            <p>CSAF: <strong>{{task.csaf_files.toString()}}</strong></p>
            <p>Playbook: <strong>{{task.playbook.toString()}}</strong></p>
        </Panel>
    </div>

    <div class="p-grid button-demo">
        <!-- CSAF document presentation -->
        <div class="p-col-12 p-md-6">
            <div class="card" v-if="csafsTask.length !== 0">
                <div v-for="csaf in csafsTask" :key="csaf._id">
                    <CSAFDocument :id="csaf._id"></CSAFDocument>
                </div>
            </div>
        </div>

        <div class="p-col-12 p-md-6">
            <!-- Playbook document presentation -->
            <div class="card" v-if="playbooksTask.length !== 0">
                <div v-for="playbook in playbooksTask" :key="playbook._id">
                    <PlaybookDocument :id="playbook._id"></PlaybookDocument>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CSAFDocument from '../csaf/CSAFDocument.vue';
import PlaybookDocument from '../playbook/PlaybookDocument.vue';

export default {
    props: ['id'],
    components: {
        CSAFDocument,
        PlaybookDocument
    },
	data() {
		return {
            infoVisible: false,
            task: null,
            editable: false
		}
	},
    computed: {
        playbooksTask() {
            return this.$store.getters['playbook/arrList'];
        },
        csafsTask() {
            return this.$store.getters['csaf/arrList'];
        }
    },
    methods: {
        async fetchData() {
            try {

                await this.$store.dispatch('task/get', {_id: this.id});
                this.task = this.$store.getters['task/getById'](this.id);

                if (this.task) {
                    await this.$store.dispatch('csaf/getByIdArray', this.task.csaf_files);

                    await this.$store.dispatch('playbook/getByIdArray', this.task.playbook);

                    this.editable = !this.task.approved
                }
                
                this.infoVisible = true
            } catch (error) {
                console.log(error);
            }
        },
        editPlaybook() { // when the playbook should be edited the app navigates to the desired component
            console.log('EDIT PLAYBOOK');
            this.$router.push(
                {
                    name: 'editPlaybookForTask',
                    params: { id: this.playbooksTask[0]._id, taskId: this.id }
                }
            );
        },
        createPlaybook() { // when a playbook should be created the app navigates to the desired component
            console.log('CREATE PLAYBOOK');
            this.$router.push(
                {
                    name: 'createPlaybookForTask',
                    params: { taskId: this.id }
                }
            );
        },
        async approveTask() { // method for approving a task object
            try {
                const taskToUpdate = this.task;
                taskToUpdate.approved = true;
                taskToUpdate.modified = new Date().toISOString();
                await this.$store.dispatch('task/update', {...taskToUpdate, _id: taskToUpdate._id}); // update task document


                this.$router.push({ name: 'singletaskview', params: { id: taskToUpdate._id }}).then(() => {
                        this.$toast.add({ severity: 'success', summary: 'Task approved!', life: 2000 });
                });
            } catch(error) {
                console.log(error)
                this.$toast.add({severity:'error', summary: 'Error while approving task!', life: 2000});
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