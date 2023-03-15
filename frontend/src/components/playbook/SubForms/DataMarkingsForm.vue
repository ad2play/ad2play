<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Mrk ' + id}}</h5>

            <div class="p-field">
                <label for="key">KEY*</label>
                <p>{{key}}</p>
            </div>

            <div class="p-field">
                <label for="type">Type*</label>
                <Dropdown id="type" :options="markingtype" placeholder="Choose Type" @change="resetForm"
                :class="{'p-error': !type.isValid}"
                v-model="type.val" @blur="clearValidity('type')" aria-describedby="type-help" 
                v-tooltip.left="'Please choose the type of the marking.'"/>
                <small v-if="!type.isValid && type.required" id="type-help" class="p-error">Please choose a type!</small>
            </div>

            <div class="p-field">
                <label for="name">Name</label>
                <InputText id="name" v-model.trim="name.val"
                @blur="clearValidity('name')" aria-describedby="name-help" v-tooltip.left="'Input field for the name of the marking.'"/>
                <small v-if="!name.isValid && name.required" 
                id="name-help" class="p-error">Please input the name of the marking!</small>
            </div>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the marking.'"/>
                <small v-if="!description.isValid && description.required" 
                id="description-help" class="p-error">Please input the description of the marking!</small>
            </div>

            <div class="p-field">
                <label for="created_by">Created by*</label>
                <InputText id="created_by" v-model.trim="created_by.val" :class="{'p-error': !created_by.isValid}"
                @blur="clearValidity('created_by')" aria-describedby="created_by-help" v-tooltip.left="'Input field for the created_by of the marking.'"/>
                <small v-if="!created_by.isValid && created_by.required" 
                id="created_by-help" class="p-error">Please input the created_by of the marking!</small>
            </div>

            <div class="p-field">
                <div class="p-field">
                    <label for="created">Created*</label>
                    <Calendar 
                    id="created"
                    :showIcon="true"                        
                    :yearNavigator="true"
                    :yearRange="yearRange"
                    v-model="created.val"
                    @blur="clearValidity('created')" aria-describedby="created-help"
                    v-tooltip.left="'Input the date the playbook is valid until'"
                    ></Calendar>
                    <small v-if="!created.isValid && created.required" id="created-help" class="p-error">Please input the date of creation!</small>
                </div>
            </div>

            <div class="p-field">
                <div class="p-field">
                    <label for="valid_from">Valid from</label>
                    <Calendar 
                    id="valid_from"
                    :showIcon="true"                        
                    :yearNavigator="true"
                    :yearRange="yearRange"
                    v-model="valid_from.val"
                    @blur="clearValidity('valid_from')" aria-describedby="valid_from-help"
                    v-tooltip.left="'Input the date the playbook is valid from'"
                    ></Calendar>
                    <small v-if="!valid_from.isValid && valid_from.required" id="valid_from-help" class="p-error">Please input the start date of the validity!</small>
                </div>
            </div>

            <div class="p-field">
                <div class="p-field">
                    <label for="valid_until">Valid until</label>
                    <Calendar 
                    id="valid_until"
                    :showIcon="true"                        
                    :yearNavigator="true"
                    :yearRange="yearRange"
                    v-model="valid_until.val"
                    @blur="clearValidity('valid_until')" aria-describedby="valid_until-help"
                    v-tooltip.left="'Input the date the playbook is valid until'"
                    ></Calendar>
                    <small v-if="!valid_until.isValid && valid_until.required" id="valid_until-help" class="p-error">Please input the end date of the validity!</small>
                </div>
            </div>

            <div class="p-field">
                <label for="labels">Labels</label>
                <InputText id="labels" :class="{'p-error': !labels.isValid && labels.required}" v-model.trim="labels.val"
                @blur="clearValidity('labels')" aria-describedby="labels-help" v-tooltip.left="'Input field for comma separated labels.'"/>
                <small v-if="!labels.isValid && labels.required" id="labels-help" class="p-error">Please input the labels as comma separated values!</small>
            </div>

            <div v-if="['marking-statement'].includes(type.val)">
                <div class="p-field">
                    <label for="statement">Statement</label>
                    <InputText id="statement" v-model.trim="statement.val"
                    @blur="clearValidity('statement')" aria-describedby="statement-help" v-tooltip.left="'Input field for the statement of the marking.'"/>
                    <small v-if="!statement.isValid && statement.required" 
                    id="statement-help" class="p-error">Please input the statement of the marking!</small>
                </div>
            </div>

            <div v-if="['marking-tlp', 'marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="tlp_level">TLP level</label>
                    <Dropdown id="tlp_level" :options="tlpLevels" placeholder="Choose level"
                    :class="{'p-error': !tlp_level.isValid}"
                    v-model="tlp_level.val" @blur="clearValidity('tlp_level')" aria-describedby="tlp_level-help" 
                    v-tooltip.left="'Please choose the tlp_level of the marking.'"/>
                    <small v-if="!tlp_level.isValid && tlp_level.required" id="tlp_level-help" class="p-error">Please choose a tlp_level!</small>
                </div>
            </div>

            <div v-if="['marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="iep_version">IEP Version</label>
                    <InputText id="iep_version" v-model.trim="iep_version.val"
                    @blur="clearValidity('iep_version')" aria-describedby="iep_version-help" v-tooltip.left="'Input field for the iep_version of the marking.'"/>
                    <small v-if="!iep_version.isValid && iep_version.required" 
                    id="iep_version-help" class="p-error">Please input the iep_version of the marking!</small>
                </div>
            </div>

            <div v-if="['marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="start_date">Start date</label>
                    <Calendar 
                    id="start_date"
                    :showIcon="true"                        
                    :yearNavigator="true"
                    :yearRange="yearRange"
                    v-model="start_date.val"
                    @blur="clearValidity('start_date')" aria-describedby="start_date-help"
                    v-tooltip.left="'Input the start date'"
                    ></Calendar>
                    <small v-if="!start_date.isValid && start_date.required" id="start_date-help" class="p-error">Please input the start_date!</small>
                </div>
            </div>

            <div v-if="['marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="end_date">End date</label>
                    <Calendar 
                    id="end_date"
                    :showIcon="true"                        
                    :yearNavigator="true"
                    :yearRange="yearRange"
                    v-model="end_date.val"
                    @blur="clearValidity('end_date')" aria-describedby="end_date-help"
                    v-tooltip.left="'Input the end date'"
                    ></Calendar>
                    <small v-if="!end_date.isValid && end_date.required" id="end_date-help" class="p-error">Please input the end_date!</small>
                </div>
            </div>

            <div v-if="['marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="encrypt_in_transit">Encrypt in transit</label>
                    <InputText id="encrypt_in_transit" v-model.trim="encrypt_in_transit.val"
                    @blur="clearValidity('encrypt_in_transit')" aria-describedby="encrypt_in_transit-help" v-tooltip.left="'Input field for the encrypt_in_transit of the marking.'"/>
                    <small v-if="!encrypt_in_transit.isValid && encrypt_in_transit.required" 
                    id="encrypt_in_transit-help" class="p-error">Please input the encrypt_in_transit of the marking!</small>
                </div>
            </div>

            <div v-if="['marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="permitted_actions">Permitted actions</label>
                    <InputText id="permitted_actions" v-model.trim="permitted_actions.val"
                    @blur="clearValidity('permitted_actions')" aria-describedby="permitted_actions-help" v-tooltip.left="'Input field for the permitted_actions of the marking.'"/>
                    <small v-if="!permitted_actions.isValid && permitted_actions.required" 
                    id="permitted_actions-help" class="p-error">Please input the permitted_actions of the marking!</small>
                </div>
            </div>

            <div v-if="['marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="attribution">Attribution</label>
                    <InputText id="attribution" v-model.trim="attribution.val"
                    @blur="clearValidity('attribution')" aria-describedby="attribution-help" v-tooltip.left="'Input field for the attribution of the marking.'"/>
                    <small v-if="!attribution.isValid && attribution.required" 
                    id="attribution-help" class="p-error">Please input the attribution of the marking!</small>
                </div>
            </div>

            <div v-if="['marking-iep'].includes(type.val)">
                <div class="p-field">
                    <label for="unmodified_resale">Unmodified resale</label>
                    <InputText id="unmodified_resale" v-model.trim="unmodified_resale.val"
                    @blur="clearValidity('unmodified_resale')" aria-describedby="unmodified_resale-help" v-tooltip.left="'Input field for the unmodified_resale of the marking.'"/>
                    <small v-if="!unmodified_resale.isValid && unmodified_resale.required" 
                    id="unmodified_resale-help" class="p-error">Please input the unmodified_resale of the marking!</small>
                </div>
            </div>

            <div class="p-field">
                <h6 for="revoked">Revoked</h6>
                <InputSwitch id="revoked" v-model="revoked.val" v-tooltip.left="'Revoked value of the marking.'"/>
            </div>

            <div class="card p-fluid">
                <div>
                    <h4>External References</h4>
                    <div v-for="index in extRefCounter" :key="index">
                        <ReferencesForm @provide-references="setExternalReferences" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initReferencesdata, index)"></ReferencesForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="extRefCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="extRefCounter -= 1" v-if="extRefCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <div class="card p-fluid">
                <div>
                    <h4>Marking Extensions</h4>
                    <div v-for="index in extensionsCounter" :key="index">
                        <ExtensionsForm @provide-extension="setExtensions" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initExtensiondata, index)"></ExtensionsForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="extensionsCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="extensionsCounter -= 1" v-if="extensionsCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </form>
</template>

<script>
import ExtensionsForm from './ExtensionsForm.vue';
import ReferencesForm from './ReferencesForm.vue';

export default {
    emits: ["provide-marking", "form-invalid"],
    props: ["edit", "trigger", "id", "initData"],
    components: {
        ExtensionsForm,
        ReferencesForm
    },
	data() {
		return {
            subFormsEmitted: false,
            extensionsCounter: 0,
            extensionsEmitted: false,
            extensionsEmittedCounter: 0,
            externalReferences: [],
            extRefCounter: 0,
            referencesEmitted: false,
            referencesEmittedCounter: 0,
            markingtype: [ // enumerations to be compliant to CACAO
                'marking-statement',
                'marking-tlp',
                'marking-iep'
            ],
            tlpLevels: [ // enumerations to be compliant to CACAO
                'TLP:RED',
                'TLP:AMBER',
                'TLP:GREEN',
                'TLP:WHITE'
            ],
            type: {
                val: '',
                isValid: true,
                required: true
            },
            name: {
                val: '',
                isValid: true,
                required: false
            },
            description: {
                val: '',
                isValid: true,
                required: false
            },
            created_by: {
                val: '',
                isValid: true,
                required: true
            },
            created: {
                val: null,
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
            labels: {
                val: '',
                isValid: true,
                required: false
            },
            statement: {
                val: '',
                isValid: true,
                required: false
            },
            tlp_level: {
                val: '',
                isValid: true,
                required: false
            },
            iep_version: {
                val: '',
                isValid: true,
                required: false
            },
            start_date: {
                val: null,
                isValid: true,
                required: false
            },
            end_date: {
                val: null,
                isValid: true,
                required: false
            },
            encrypt_in_transit: {
                val: '',
                isValid: true,
                required: false
            },
            permitted_actions: {
                val: '',
                isValid: true,
                required: false
            },
            attribution: {
                val: '',
                isValid: true,
                required: false
            },
            unmodified_resale: {
                val: '',
                isValid: true,
                required: false
            },
            extensions: [],
            initReferencesdata: null,
            initExtensiondata: null
        };
	},
    watch: {
        subFormsEmitted: function(newVal) {
            if (newVal) {
                this.submitForm();
            }
        },
        trigger: function() {
            this.checkSubEmits();
        },
        '$route': 'loadData',
        initData: function() {
            this.loadData();
        },
    },
    created() {
        this.loadData();
    },
    mounted() {
        this.loadData();
    },
    computed: {
        key() { // the key of each data marking is calculated using all properties of the object
            const ret = {};
            
            if (this.type.isValid) ret['type'] = this.type.val;
            if (this.name.isValid) ret['name'] = this.name.val;
            if (this.description.isValid) ret['description'] = this.description.val;
            if (this.created_by.isValid) ret['created_by'] = this.created_by.val;
            if (this.created.isValid) ret['created'] = new Date(this.created.val).toISOString();
            if (this.revoked.isValid) ret['revoked'] = this.revoked.val;
            if (this.valid_from.isValid) ret['valid_from'] = new Date(this.valid_from.val).toISOString();
            if (this.valid_until.isValid) ret['valid_until'] = new Date(this.valid_until.val).toISOString();
            if (this.labels.isValid) ret['labels'] = this.labels.val.split(',').filter(function (el) {return el !== '';});
            if (this.statement.isValid) ret['statement'] = this.statement.val;
            if (this.tlp_level.isValid) ret['tlp_level'] = this.tlp_level.val;
            if (this.iep_version.isValid) ret['iep_version'] = this.iep_version.val;
            if (this.start_date.isValid) ret['start_date'] = new Date(this.start_date.val).toISOString();
            if (this.end_date.isValid) ret['end_date'] = new Date(this.end_date.val).toISOString();
            if (this.encrypt_in_transit.isValid) ret['encrypt_in_transit'] = this.encrypt_in_transit.val;
            if (this.permitted_actions.isValid) ret['permitted_actions'] = this.permitted_actions.val;
            if (this.attribution.isValid) ret['attribution'] = this.attribution.val;
            if (this.unmodified_resale.isValid) ret['unmodified_resale'] = this.unmodified_resale.val;
            if (this.extensions.length !== 0) ret['marking_extensions'] = this.$store.getters['help/createDictionary'](this.extensions);
            if (this.externalReferences.length !== 0) ret['external_references'] = this.externalReferences;

            return this.$store.getters['uuid/uuidv5']('marking-statement', ret);
        },
        yearRange() { // for the calendar input
            const limitEnd =  new Date().getFullYear() + 20;
            const limitStart = new Date().getFullYear() - 20;
            return limitStart + ':' + limitEnd
        }
    },
    methods: {
        loadData() { // loading data into the form
            if (this.initData) {
                if (this.initData.ret.type) this.type.val = this.initData.ret.type;
                if (this.initData.ret.name) this.name.val = this.initData.ret.name;
                if (this.initData.ret.description) this.description.val = this.initData.ret.description;
                if (this.initData.ret.created_by) this.created_by.val = this.initData.ret.created_by;
                if (this.initData.ret.created) this.created.val = new Date(this.initData.ret.created);
                if (this.initData.ret.revoked !== null) this.revoked.val = this.initData.ret.revoked;
                if (this.initData.ret.valid_from) this.valid_from.val = new Date(this.initData.ret.valid_from);
                if (this.initData.ret.valid_until) this.valid_until.val = new Date(this.initData.ret.valid_until);
                if (this.initData.ret.labels) this.labels.val = this.initData.ret.labels.toString();
                if (this.initData.ret.statement) this.statement.val = this.initData.ret.statement;
                if (this.initData.ret.tlp_level) this.tlp_level.val = this.initData.ret.tlp_level;
                if (this.initData.ret.iep_version) this.iep_version.val = this.initData.ret.iep_version;
                if (this.initData.ret.start_date) this.start_date.val = new Date(this.initData.ret.start_date);
                if (this.initData.ret.end_date) this.end_date.val = new Date(this.initData.ret.end_date);
                if (this.initData.ret.permitted_actions) this.permitted_actions.val = this.initData.ret.permitted_actions;
                if (this.initData.ret.attribution) this.attribution.val = this.initData.ret.attribution;
                if (this.initData.ret.unmodified_resale) this.unmodified_resale.val = this.initData.ret.unmodified_resale;

                if (this.initData.ret.external_references.length !== 0) {
                    this.initReferencesdata = this.initData.ret.external_references;
                    this.extRefCounter = this.initReferencesdata.length
                }

                if (this.initData.ret.marking_extensions) {
                    this.initExtensiondata = this.$store.getters['help/reverseDictionary'](this.initData.ret.marking_extensions);
                    this.extensionsCounter = this.initExtensiondata.length
                }
            }
        },
        getInitData(data, index) {
            if (data) {
                if (data[index - 1]) {
                    return data[index - 1];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        setExtensions(event) { // save the data submitted from the extension form
            this.extensions.push(event);
            
            this.extensionsEmittedCounter += 1;
            if (this.extensionsEmittedCounter === this.extensionsCounter) {
                this.extensionsEmitted = true;
            }
            this.checkSubEmits();
        },
        setExternalReferences(event) { // save the data submitted from the externalreferences form
            this.externalReferences.push(event.ret);

            this.referencesEmittedCounter += 1;
            if (this.referencesEmittedCounter === this.extRefCounter) {
                this.referencesEmitted = true;
            }
            this.checkSubEmits();
        },
        checkSubEmits() { // checks if all subforms have submitted the right amount of data
            if (this.extensionsCounter === 0) {
                this.extensionsEmitted = true;
            }

            if (this.extRefCounter === 0) {
                this.referencesEmitted = true;
            }
            
            if (this.extensionsEmitted && this.referencesEmitted) {
                this.subFormsEmitted = true;
            }
        },
        resetForm() { // clears the inputs of the form
            this.name.val = '';
            this.description.val = '';
            this.name.val = '';
            this.description.val = '';
            this.created_by.val = '';
            this.created.val = null;
            this.revoked.val = false;
            this.valid_from.val = null;
            this.valid_until.val = null;
            this.labels.val = '';
            this.statement.val = '';
            this.tlp_level.val = '';
            this.iep_version.val = '';
            this.start_date.val = null;
            this.end_date.val = null;
            this.encrypt_in_transit.val = '';
            this.permitted_actions.val = '';
            this.attribution.val = '';
            this.unmodified_resale.val = '';
        },
        validateInputs() {
            var dataValid = true;
            if(this.type.val == '') {
                this.type.isValid = false;
                dataValid = false;
            }
            if(this.name.val == '') {
                this.name.isValid = false;
            }
            if(this.description.val == '') {
                this.description.isValid = false;
            }
            if(this.created_by.val == '') {
                this.created_by.isValid = false;
                dataValid = false;
            }
            if(this.created.val == null) {
                this.created.isValid = false;
                dataValid = false;
            }
            if(this.valid_from.val == null) {
                this.valid_from.isValid = false;
            }
            if(this.valid_until.val == null) {
                this.valid_until.isValid = false;
            }
            if(this.labels.val == '') {
                this.labels.isValid = false;
            }
            if(this.statement.val == '') {
                this.statement.isValid = false;
            }
            if(this.tlp_level.val == '') {
                this.tlp_level.isValid = false;
            }
            if(this.iep_version.val == '') {
                this.iep_version.isValid = false;
            }
            if(this.start_date.val == null) {
                this.start_date.isValid = false;
            }
            if(this.end_date.val == null) {
                this.end_date.isValid = false;
            }
            if(this.encrypt_in_transit.val == '') {
                this.encrypt_in_transit.isValid = false;
            }
            if(this.permitted_actions.val == '') {
                this.permitted_actions.isValid = false;
            }
            if(this.attribution.val == '') {
                this.attribution.isValid = false;
            }
            if(this.unmodified_resale.val == '') {
                this.unmodified_resale.isValid = false;
            }
            
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        emitInvalidity() {
            this.$emit("form-invalid");
        },
        submitForm(){ // submits the formdata
            this.subFormsEmitted = false; // setback to the initial values -> ensure functionalitiy of the form
            this.extensionsEmitted = false;
            this.extensionsEmittedCounter = 0;
            this.referencesEmitted = false;
            this.referencesEmittedCounter = 0;

            if(this.validateInputs()) {
                const ret = {};
                if (this.type.isValid) ret['type'] = this.type.val;
                if (this.name.isValid) ret['name'] = this.name.val;
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.created_by.isValid) ret['created_by'] = this.created_by.val;
                if (this.created.isValid) ret['created'] = new Date(this.created.val).toISOString();
                if (this.created.isValid) ret['modified'] = new Date(this.created.val).toISOString();
                if (this.revoked.isValid) ret['revoked'] = this.revoked.val;
                if (this.valid_from.isValid) ret['valid_from'] = new Date(this.valid_from.val).toISOString();
                if (this.valid_until.isValid) ret['valid_until'] = new Date(this.valid_until.val).toISOString();
                if (this.labels.isValid) ret['labels'] = this.labels.val.split(',').filter(function (el) {return el !== '';});
                if (this.statement.isValid) ret['statement'] = this.statement.val;
                if (this.tlp_level.isValid) ret['tlp_level'] = this.tlp_level.val;
                if (this.iep_version.isValid) ret['iep_version'] = this.iep_version.val;
                if (this.start_date.isValid) ret['start_date'] = new Date(this.start_date.val).toISOString();
                if (this.end_date.isValid) ret['end_date'] = new Date(this.end_date.val).toISOString();
                if (this.encrypt_in_transit.isValid) ret['encrypt_in_transit'] = this.encrypt_in_transit.val;
                if (this.permitted_actions.isValid) ret['permitted_actions'] = this.permitted_actions.val;
                if (this.attribution.isValid) ret['attribution'] = this.attribution.val;
                if (this.unmodified_resale.isValid) ret['unmodified_resale'] = this.unmodified_resale.val;
                if (this.extensions.length !== 0) ret['marking_extensions'] = this.$store.getters['help/createDictionary'](this.extensions);
                if (this.externalReferences.length !== 0) ret['external_references'] = this.externalReferences;
                ret['key'] = this.key;

                this.extensions = [];
                this.externalReferences = [];

                this.$emit("provide-marking", {
                    ret: ret,
                    index: this.id
                });                               
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