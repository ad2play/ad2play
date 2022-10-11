// subcomponent for a datatable that includes task data (can be used multiple times for different task datasets)
<template>
    <div class="p-datatable-responsive-demo">
		<div class="card">
			<DataTable
            :resizableColumns="true"
            :autoLayout="true"
            :rowHover="true"
            :value="data"
            selectionMode="single"
            @rowSelect="itemSelected"
            class="p-datatable-customers" 
            responsiveLayout="stack"
            breakpoint="960px"
            :rows="25" style="margin-bottom: 20px" 
            :paginator="true" 
            :rowsPerPageOptions="[5, 10, 25, 50, 100]" 
            v-model:filters="filters"
            dataKey="_id"
            sortField="created" :sortOrder="-1">

                <template #header>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <h5 class="p-m-0">{{tableTitle}}</h5>
                        <span class="p-input-icon-left p-mb-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." 
                            v-tooltip.left="'Input a value the tasks should be searched for.'" />
                        </span> 
                    </div>
                </template>

				<Column field="_id" header="ID" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data._id }}
                    </template>
                </Column>
				<Column field="type" header="Type" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.type }}
                    </template>
                </Column>
				<Column field="created" header="Created" :sortable="true">
                    <template #body="slotProps">
                        {{ (slotProps.data.created != null) ? new Date(slotProps.data.created).toLocaleDateString("locale") : '' }}
                    </template>
                </Column>
                <Column field="modified" header="Modified" :sortable="true">
                    <template #body="slotProps">
                        {{ (slotProps.data.modified != null) ? new Date(slotProps.data.modified).toLocaleDateString("locale") : '' }}
                    </template>
                </Column>
                <Column field="manual_action_required" header="Manual" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.manual_action_required }}
                    </template>
                </Column>
                <Column field="done" header="Done" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.done }}
                    </template>
                </Column>
                <Column field="approved" header="Approved" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.approved }}
                    </template>
                </Column>
                <Column header="Action">
					<template #body="slotProps">
                        <Button icon="pi pi-times" type="button" class="p-button-danger p-mr-2 p-mb-1" @click="confirmDeleteTask(slotProps.data)" 
                        v-tooltip.left="'Delete Task.'" v-if="deleteEnabled"></Button>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>

<!-- dialog for checking if sth should be really deleted -> to be sure -->
    <Dialog
    v-model:visible="showDeleteDialog"
    :style="{ width: '450px' }"
    header="Are you sure to delete?"
    :modal="true"
  >
        <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="taskToDelete">Are you sure to delete the task of type  <strong>{{ taskToDelete.type }}</strong> with the ID:  
        <strong>{{ taskToDelete._id}}</strong>?</span>
        </div>
        <template #footer>
        <Button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="showDeleteDialog = false"
        />
        <Button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteTask()"
        />
        </template>
    </Dialog>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';

export default {
    props: ['data', 'deleteEnabled', 'tableTitle'],
    emits: ['task-deleted'],
	data() {
		return {
            taskToDelete: null,
            showDeleteDialog: false,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
		}
	},
    methods: {
        confirmDeleteTask(task) {
            this.taskToDelete = task;
            this.showDeleteDialog = true;
        },
        async deleteTask() { // method that deletes a task object after the dialog was answered with YES
            try {
                await this.$store.dispatch("task/delete",this.taskToDelete);
                this.showDeleteDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Task deleted!",
                    life: 2000,
                });
                this.$emit('task-deleted');
            } catch (error) {
                this.taskToDelete = {};
                this.showDeleteDialog = false;
                this.$toast.add({
                    severity: "error",
                    summary: "Error while deleting!",
                    life: 2000,
                });
            }
        },
        itemSelected(event) { // when an item of the table is clicked on, the detail page is navigated to
            this.$router.push(
                {
                    name: 'singletaskview',
                    params: { id: event.data._id }
                }
            );
        }
    }	
}
</script>