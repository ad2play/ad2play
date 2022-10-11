<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <div class="p-field">
                <label for="type">Type*</label>
                <Dropdown id="type" :options="pbTypes" placeholder="Choose Type" 
                :class="{'p-error': !type.isValid}"
                v-model="type.val" @blur="clearValidity('type')" aria-describedby="type-help" 
                v-tooltip.left="'Please choose the type of the playbook.'"/>
                <small v-if="!type.isValid && type.required" id="type-help" class="p-error">Please choose a type!</small>
            </div>

            <div class="p-field">
                <label for="name">Name*</label>
                <InputText id="name" :class="{'p-error': !name.isValid}" v-model.trim="name.val"
                @blur="clearValidity('name')" aria-describedby="name-help" v-tooltip.left="'Input field for the name of the playbook.'"/>
                <small v-if="!name.isValid && name.required" id="name-help" class="p-error">Please input the name of the playbook!</small>
            </div>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the playbook.'"/>
                <small v-if="!description.isValid && description.required" 
                id="description-help" class="p-error">Please input the description of the playbook!</small>
            </div>

            <div class="p-field">
                <label for="playbook_types">Playbook Types*</label>
                <MultiSelect  id="playbook_types" :class="{'p-error': !playbook_types.isValid}" :options="playbookTypes" v-model="playbook_types.val"
                @blur="clearValidity('playbook_types')" aria-describedby="playbook_types-help" v-tooltip.left="'Selection field for playbook types.'"
                placeholder="Choose Playbook Types"/>
                <small v-if="!playbook_types.isValid && playbook_types.required" 
                id="playbook_types-help" class="p-error">Please select the playbook types!</small>
            </div>

            <div class="p-field">
                <label for="created_by">Created by*</label>
                <InputText id="created_by" :class="{'p-error': !created_by.isValid}" v-model.trim="created_by.val"
                @blur="clearValidity('created_by')" aria-describedby="created_by-help" v-tooltip.left="'Input field for the creator of the playbook.'"/>
                <small v-if="!created_by.isValid && created_by.required" id="created_by-help" class="p-error">Please input the creator of the playbook!</small>
            </div>

            <div class="p-field">
                <label for="valid_from">Valid from</label>
                <Calendar 
                id="valid_from"
                :showIcon="true"                        
                :yearNavigator="true"
                :yearRange="yearRange"
                :class="{'p-error': !valid_from.isValid}" v-model="valid_from.val"
                @blur="clearValidity('valid_from')" aria-describedby="valid_from-help"
                v-tooltip.left="'Input the date the playbook is valid from'"
                ></Calendar>
                <small v-if="!valid_from.isValid && valid_from.required" id="valid_from-help" class="p-error">Please input the date the validity starts!</small>
            </div>

            <div class="p-field">
                <label for="valid_until">Valid until</label>
                <Calendar 
                id="valid_until"
                :showIcon="true"                        
                :yearNavigator="true"
                :yearRange="yearRange"
                :class="{'p-error': !valid_until.isValid}" v-model="valid_until.val"
                @blur="clearValidity('valid_until')" aria-describedby="valid_until-help"
                v-tooltip.left="'Input the date the playbook is valid until'"
                ></Calendar>
                <small v-if="!valid_until.isValid && valid_until.required" id="valid_until-help" class="p-error">Please input the date the validity ends!</small>
            </div>

            <div class="p-field">
                <label for="derived_from">Derived from</label>
                <InputText id="derived_from" :class="{'p-error': !derived_from.isValid && derived_from.required}" v-model.trim="derived_from.val"
                @blur="clearValidity('derived_from')" aria-describedby="derived_from-help" v-tooltip.left="'Input field for comma separated identifier.'"/>
                <small v-if="!derived_from.isValid && derived_from.required" id="derived_from-help" class="p-error">Please input the identifier as comma separated values!</small>
            </div>

            <div class="p-field">
                <label for="labels">Labels</label>
                <InputText id="labels" :class="{'p-error': !labels.isValid && labels.required}" v-model.trim="labels.val"
                @blur="clearValidity('labels')" aria-describedby="labels-help" v-tooltip.left="'Input field for comma separated labels.'"/>
                <small v-if="!labels.isValid && labels.required" id="labels-help" class="p-error">Please input the labels as comma separated values!</small>
            </div>

            <div class="p-field">
                <label for="severity">Severity</label>
                <InputNumber id="severity" locale="de" :maxFractionDigits="0" :minFractionDigits="0" :step="1" showButtons  
                :class="{'p-error': !severity.isValid}"
                v-model="severity.val" @blur="clearValidity('severity')" aria-describedby="severity-help" 
                v-tooltip.left="'Input field for the severity'"/>
                <small v-if="!severity.isValid && severity.required" id="severity-help" class="p-error">Please input the severity!</small>
            </div>

            <div class="p-field">
                <label for="impact">Impact</label>
                <InputNumber id="impact" locale="de" :maxFractionDigits="0" :minFractionDigits="0" :step="1" showButtons  
                :class="{'p-error': !impact.isValid}"
                v-model="impact.val" aria-describedby="impact-help" 
                v-tooltip.left="'Input field for the impact'"/>
                <small v-if="!impact.isValid && impact.required" id="impact-help" class="p-error">Please input the impact!</small>
            </div>

            <div class="p-field">
                <label for="priority">Priority</label>
                <InputNumber id="priority" locale="de" :maxFractionDigits="0" :minFractionDigits="0" :step="1" showButtons  
                :class="{'p-error': !priority.isValid}"
                v-model="priority.val" @blur="clearValidity('priority')" aria-describedby="priority-help" 
                v-tooltip.left="'Input field for the priority'"/>
                <small v-if="!priority.isValid && priority.required" id="priority-help" class="p-error">Please input the priority!</small>
            </div>

            <div class="p-field">
                <h6 for="revoked">Revoked</h6>
                <InputSwitch id="revoked" v-model="revoked" v-tooltip.left="'Revoked value of the playbook.'"/>
            </div>
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-metadata", "form-invalid"],
    props: ["edit", "trigger", "initData"],
	data() {
		return {
            pbTypes: [
                'playbook',
                'playbook-template'
            ],
            playbookTypes: [
                'notification',
                'detection',
                'investigation',
                'prevention',
                'mitigation',
                'remediation',
                'attack',
            ],
            type: {
                val: '',
                isValid: true,
                required: true
            },
            name: {
                val: '',
                isValid: true,
                required: true
            },
            description: {
                val: '',
                isValid: true,
                required: false
            },
            playbook_types: {
                val: null,
                isValid: true,
                required: true
            },
            created_by: {
                val: '',
                isValid: true,
                required: true
            },
            revoked: {
                val: false,
                isValid: true,
                required: false
            },
            valid_from: {
                val: null,
                isValid: true,
                required: false
            },
            valid_until: {
                val: null,
                isValid: true,
                required: false
            },
            derived_from: {
                val: '',
                isValid: true,
                required: false
            },
            priority: {
                val: null,
                isValid: true,
                required: false
            },
            severity: {
                val: null,
                isValid: true,
                required: false
            },
            impact: {
                val: null,
                isValid: true,
                required: false
            },
            labels: {
                val: '',
                isValid: true,
                required: false
            },
            created: null
        };
	},
    watch: { 
        trigger: function() {
            this.submitForm();
        },
        '$route': 'loadData',
        initData: function() {
            this.loadData();
        },
    },
    computed: {
        yearRange() { // for calendar input
            const limitEnd =  new Date().getFullYear() + 20;
            const limitStart = new Date().getFullYear() - 20;
            return limitStart + ':' + limitEnd
        }
    },
    created() {
        this.loadData();
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() { // loading existing data into form
            if (this.initData) {
                if (this.initData.created) this.created = new Date(this.initData.created);
                if (this.initData.type) this.type.val = this.initData.type;
                if (this.initData.name) this.name.val = this.initData.name;
                if (this.initData.description) this.description.val = this.initData.description;
                if (this.initData.playbook_types) this.playbook_types.val = this.initData.playbook_types;
                if (this.initData.created_by) this.created_by.val = this.initData.created_by;
                if (this.initData.revoked !== null) this.revoked.val = this.initData.revoked;
                if (this.initData.valid_from) this.valid_from.val = new Date(this.initData.valid_from);
                if (this.initData.valid_until) this.valid_until.val = new Date(this.initData.valid_until);
                if (this.initData.derived_from) this.derived_from.val = this.initData.derived_from.toString();
                if (this.initData.severity) this.severity.val = this.initData.severity;
                if (this.initData.impact) this.impact.val = this.initData.impact;
                if (this.initData.labels) this.labels.val = this.initData.labels.toString();
            }
        },
        validateInputs() {
            var dataValid = true;
            if(this.type.val == '') {
                this.type.isValid = false;
                dataValid = false;
            }
            if(this.name.val == '') {
                this.name.isValid = false;
                dataValid = false;
            }
            if(this.description.val == '') {
                this.description.isValid = false;
            }
            if(this.playbook_types.val == null) {
                this.playbook_types.isValid = false;
                dataValid = false;
            }
            if(this.created_by.val == '') {
                this.created_by.isValid = false;
                dataValid = false;
            }
            if(this.valid_from.val == null) {
                this.valid_from.isValid = false;
            }
            if(this.valid_until.val == null) {
                this.valid_until.isValid = false;
            }
            if(this.derived_from.val == '') {
                this.derived_from.isValid = false;
            }
            if(this.priority.val == null) {
                this.priority.isValid = false;
            }
            if(this.severity.val == null) {
                this.severity.isValid = false;
            }
            if(this.impact.val == null) {
                this.impact.isValid = false;
            }
            if(this.labels.val == '') {
                this.labels.isValid = false;
            }

            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // method for submitting the data
            if(this.validateInputs()) {
                const ret = {};
                ret['spec_version'] = '1.0';
                if (this.created) ret['created'] = this.created.toISOString();
                ret['modified'] = new Date().toISOString();
                if (this.type.isValid) ret['type'] = this.type.val;
                if (this.name.isValid) ret['name'] = this.name.val;
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.playbook_types.isValid) ret['playbook_types'] = this.playbook_types.val;
                if (this.created_by.isValid) ret['created_by'] = this.created_by.val;
                if (this.revoked.isValid) ret['revoked'] = this.revoked.val;
                if (this.valid_from.isValid) ret['valid_from'] = new Date(this.valid_from.val).toISOString();
                if (this.valid_until.isValid) ret['valid_until'] = new Date(this.valid_until.val).toISOString();
                if (this.derived_from.isValid) ret['derived_from'] = this.derived_from.val;
                if (this.priority.isValid) ret['priority'] = this.priority.val;
                if (this.severity.isValid) ret['severity'] = this.severity.val;
                if (this.impact.isValid) ret['impact'] = this.impact.val;
                if (this.labels.isValid) ret['labels'] = this.labels.val.split(',').filter(function (el) {return el !== '';});
                this.$emit("provide-metadata", ret);                               
            } else {
                this.$emit("form-invalid");
            }
        }
    }	
}
</script>

<style lang="scss" scoped>
    .p-inputtext.p-error {
        border-color: #f44336;
    }

    .major-card {
        border-color: #979A9D;
        border-style: solid;
    }
</style>