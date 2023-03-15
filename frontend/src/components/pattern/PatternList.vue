// subcomponent datatable that presents pattern documents
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
                            v-tooltip.left="'Input a value the pattern should be searched for.'" />
                        </span> 
                    </div>
                </template>

				<Column field="_id" header="ID" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data._id }}
                    </template>
                </Column>
				<Column field="name" header="Name" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.name }}
                    </template>
                </Column>
                <Column field="description" header="Description" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.description }}
                    </template>
                </Column>
                <Column field="matching_terms" header="Nbr Layer" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.matching_terms.length }}
                    </template>
                </Column>
				
                <Column header="Action">
					<template #body="slotProps">
                        <Button icon="pi pi-pencil" type="button" class="p-button-warning p-mr-2 p-mb-1" @click="alterPattern(slotProps.data)" 
                        v-tooltip.left="'Edit Pattern.'"></Button>
                        <Button icon="pi pi-times" type="button" class="p-button-danger p-mr-2 p-mb-1" @click="confirmDeletePattern(slotProps.data)" 
                        v-tooltip.left="'Delete Pattern.'" v-if="deleteEnabled"></Button>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>

<!-- dialog for asuring that no pattern is deleted by accident -->
    <Dialog
    v-model:visible="showDeleteDialog"
    :style="{ width: '450px' }"
    header="Are you sure to delete?"
    :modal="true"
  >
        <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="patternToDelete">Are you sure to delete the Pattern with the name  <strong>{{ patternToDelete.name }}</strong> and the ID:  
        <strong>{{ patternToDelete._id}}</strong>?</span>
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
            @click="deletePattern()"
        />
        </template>
    </Dialog>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';

export default {
    props: ['data', 'deleteEnabled', 'tableTitle'],
    emits: ['pattern-deleted'],
	data() {
		return {
            patternToDelete: null,
            showDeleteDialog: false,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
		}
	},
    methods: {
        confirmDeletePattern(pattern) {
            this.patternToDelete = pattern;
            this.showDeleteDialog = true;
        },
        async deletePattern() { // method to delete a pattern
            try {
                await this.$store.dispatch("pattern/delete",this.patternToDelete);
                this.showDeleteDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Pattern deleted!",
                    life: 2000,
                });
                this.$emit('pattern-deleted');
            } catch (error) {
                this.patternToDelete = {};
                this.showDeleteDialog = false;
                this.$toast.add({
                    severity: "error",
                    summary: "Error while deleting!",
                    life: 2000,
                });
            }
        },
        itemSelected(event) { // when a item of the table is clicked at the detail view is navigated to
            this.$router.push(
                {
                    name: 'singlepatternview',
                    params: { id: event.data._id }
                }
            );
        },
        alterPattern(data) { // when the pattern must be altered the dedicated component is called
            this.$router.push(
                {
                    name: 'editPattern',
                    params: { id: data._id }
                }
            );
        }
    }	
}
</script>