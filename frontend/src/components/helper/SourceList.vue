// subcomponent datatable with all the sources that are used in the backend -> give the user some overview 

<template>
    <div class="p-datatable-responsive-demo">
		<div class="card">
			<DataTable
            :resizableColumns="true"
            :autoLayout="true"
            :rowHover="true"
            :value="data"
            selectionMode="single"
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
                        <h5 class="p-m-0">Sources</h5>
                        <span class="p-input-icon-left p-mb-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." 
                            v-tooltip.left="'Input a value the sources should be searched for.'" />
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
                <Column field="url" header="URL" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.url }}
                    </template>
                </Column>
                <Column field="last_fetch" header="Timestamp Last Fetch" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data.last_fetch }}
                    </template>
                </Column>
            </DataTable>
		</div>
	</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';

export default {
    props: ['data'],
	data() {
		return {
            patternToDelete: null,
            showDeleteDialog: false,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
		}
	}	
}
</script>