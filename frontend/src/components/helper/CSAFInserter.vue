// component that allows the user to directly insert a CSAF JSON file by drag and drop and create a corresponding task
// this doesn't belong to the scope of the system described in the work but is a nice feature for the user
<template>       
    <form @submit.prevent="submitForm" v-if="formVisible">
        <div class="card p-fluid">
            <h3>Task</h3>
            <!-- form fields for user input -->
            <div class="p-field">
                <label for="type">Type*</label>
                <InputText id="type" v-model.trim="type.val" :class="{'p-error': !type.isValid}"
                @blur="clearValidity('type')" aria-describedby="type-help" v-tooltip.left="'Input field for the type of the task.'"/>
                <small v-if="!type.isValid && type.required" id="type-help" class="p-error">Please input the type of the task!</small>
            </div>

            <div class="p-field">
                <label for="description">Description*</label>
                <InputText id="description" v-model.trim="description.val" :class="{'p-error': !type.isValid}"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the task.'"/>
                <small v-if="!description.isValid && description.required" id="description-help" class="p-error">Please input the description of the task!</small>
            </div>

            <div class="p-field">
                <label for="assigned_to">Assigned To</label>
                <InputText id="assigned_to" v-model.trim="assigned_to.val" 
                @blur="clearValidity('assigned_to')" aria-describedby="assigned_to-help" v-tooltip.left="'Input field for the assigned_to of the task.'"/>
                <small v-if="!assigned_to.isValid && assigned_to.required" id="assigned_to-help" class="p-error">Please input the assigned_to of the task!</small>
            </div>

            <div class="p-field" v-if="entityTags">
                <label for="entity_tags">Entity Tags*</label>
                <MultiSelect  id="entity_tags" :options="entityTags" v-model="entity_tags.val" :class="{'p-error': !type.isValid}"
                @blur="clearValidity('entity_tags')" aria-describedby="entity_tags-help" v-tooltip.left="'Selection field for playbook types.'"
                placeholder="Choose steps entity_tags"/>
                <small v-if="!entity_tags.isValid && entity_tags.required" 
                id="entity_tags-help" class="p-error">Please select the entity_tags of the task!</small>
            </div>

            <div class="p-field" v-if="groupsTags">
                <label for="group_tags">Group Tags*</label>
                <MultiSelect  id="group_tags" :options="groupsTags" v-model="group_tags.val" :class="{'p-error': !type.isValid}"
                @blur="clearValidity('group_tags')" aria-describedby="group_tags-help" v-tooltip.left="'Selection field for playbook types.'"
                placeholder="Choose steps group_tags"/>
                <small v-if="!group_tags.isValid && group_tags.required" 
                id="group_tags-help" class="p-error">Please select the group_tags of the task!</small>
            </div>

            <div class="p-field">
                <label>CSAF file (JSON)</label>
                <FileUpload name="csafjson" :customUpload="true" @uploader="myUploader" :multiple="false" accept=".json" :maxFileSize="1000000" 
                uploadLabel="Upload" chooseLabel="Choose" cancelLabel="Cancel" url="./upload" :auto="true" :class="{'p-error': !type.isValid}">
                    <template #empty>
                        <p>Drag and drop a CSAF - JSON file here!</p>
                    </template>
                </FileUpload>
                <small v-if="!csafjson.isValid && csafjson.required" 
                id="csafjson-help" class="p-error">Please slect and upload a CSAF JSON file!</small>
            </div>

            <div class="p-field">
                <Button label="Submit" type="submit" v-tooltip.left="'Submit Form.'"></Button>
            </div>
        </div>
    </form>
</template>

<script>

export default {
	data() {
		return {
            formVisible: false,
            type: {
                val: '',
                isValid: true,
                required: true
            },
            description: {
                val: '',
                isValid: true,
                required: true
            },
            assigned_to: {
                val: '',
                isValid: true,
                required: false
            },
            entity_tags: {
                val: null,
                isValid: true,
                required: true
            },
            group_tags: {
                val: null,
                isValid: true,
                required: true
            },
            csafjson: {
                val: null,
                isValid: true,
                required: true
            }
        };
	},
    created() {
        this.loadData();
    },
    computed: { // twin data is used for specifying the task
        entityTags() { 
            const twins = this.$store.getters['twin/list'];
            let ret = [];
            for (const t of twins) {
                ret = ret.concat(t.attributes.security.entity_tags);
            }
            return [...new Set(ret)];
        },
        groupsTags() {
            const twins = this.$store.getters['twin/list'];
            let ret = [];
            for (const t of twins) {
                ret = ret.concat(t.attributes.security.group_tags);
            }
            return [...new Set(ret)];
        }
    },
    methods: {
        async loadData() {
            try{
                await this.$store.dispatch('twin/fetchAll', {
                    forceRefresh: true
                });
                this.formVisible = true;
            } catch (error) {
                console.log(error);
            }
        },
        myUploader(event) {            
            this.csafjson.val = event.files[0];
            this.clearValidity('csafjson');
        },
        validateInputs() {
            var dataValid = true;
            if(this.type.val == '') {
                this.type.isValid = false;
                dataValid = false;
            }
            if(this.description.val == '') {
                this.description.isValid = false;
                dataValid = false;
            }
            if(this.assigned_to.val == '') {
                this.assigned_to.isValid = false;
            }
            if(this.entity_tags.val == null) {
                this.entity_tags.isValid = false;
                dataValid = false;
            }
            if(this.group_tags.val == null) {
                this.group_tags.isValid = false;
                dataValid = false;
            }
            if(this.csafjson.val == null) {
                this.csafjson.isValid = false;
                dataValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        async submitForm(){
            try {
                if(this.validateInputs()) {
                    const ret = {};
                    if (this.type.isValid) ret['type'] = this.type.val;
                    if (this.description.isValid) ret['description'] = this.description.val;
                    if (this.entity_tags.isValid) ret['entity_tags'] = this.entity_tags.val;
                    if (this.group_tags.isValid) ret['group_tags'] = this.group_tags.val;
                    if (this.assigned_to.isValid) ret['assigned_to'] = this.assigned_to.val;
                    ret['manual_action_required'] = false;
                    ret['done'] = false;
                    ret['approved'] = false;
                    ret['playbook'] = [];

                    if (this.csafjson.isValid) {
                        const file = new FormData();
                        file.append("csafjson", this.csafjson.val)
                        await this.$store.dispatch('csaf/create', file); //create CSAF file first
                        const csafId = this.$store.getters['csaf/getRecentCreated']._id;

                        if (csafId) ret['csaf_files'] = [csafId];
                        await this.$store.dispatch('task/create', ret); // create task with the id of the previously creted csaf file                   
                        const taskId = this.$store.getters['task/getRecentCreated']._id;             

                        this.$router.push({ name: 'singletaskview', params: { id: taskId }}).then(() => {
                                this.$toast.add({ severity: 'success', summary: 'Pattern created!', life: 2000 });
                        });

                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Please upload the file before submitting it!', life: 2000 });
                    }
                } 
            } catch (err) {
                this.$toast.add({ severity: 'error', summary: 'Error while creating Task!', life: 2000 });
            }
            
        }
    }	
}
</script>

<style lang="scss" scoped>
    .p-inputtext.p-error {
        border-color: #f44336;
    }
</style>