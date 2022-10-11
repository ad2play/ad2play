<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Ext ' + id}}</h5>

            <div class="p-field">
                <label for="key">KEY*</label>
                <p>{{key}}</p>
            </div>

            <div class="p-field">
                <label for="type">Type*</label>
                <p>{{type.val}}</p>
            </div>

            <div class="p-field">
                <label for="name">Name*</label>
                <InputText id="name" :class="{'p-error': !name.isValid}" v-model.trim="name.val"
                @blur="clearValidity('name')" aria-describedby="name-help" v-tooltip.left="'Input field for the name of the extension.'"/>
                <small v-if="!name.isValid && name.required" 
                id="name-help" class="p-error">Please input the name of the extension!</small>
            </div>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the extension.'"/>
                <small v-if="!description.isValid && description.required" 
                id="description-help" class="p-error">Please input the description of the extension!</small>
            </div>

            <div class="p-field">
                <label for="created_by">Created by*</label>
                <InputText id="created_by" v-model.trim="created_by.val"
                @blur="clearValidity('created_by')" aria-describedby="created_by-help" v-tooltip.left="'Input field for the created_by of the extension.'"/>
                <small v-if="!created_by.isValid && created_by.required" 
                id="created_by-help" class="p-error">Please input the created_by of the extension!</small>
            </div>

            <div class="p-field">
                <label for="schema">Schema*</label>
                <InputText id="schema" v-model.trim="schema.val"
                @blur="clearValidity('schema')" aria-describedby="schema-help" v-tooltip.left="'Input field for the schema of the extension.'"/>
                <small v-if="!schema.isValid && schema.required" 
                id="schema-help" class="p-error">Please input the schema of the extension!</small>
            </div>

            <div class="p-field">
                <label for="version">Version*</label>
                <InputText id="version" v-model.trim="version.val"
                @blur="clearValidity('version')" aria-describedby="version-help" v-tooltip.left="'Input field for the version of the extension.'"/>
                <small v-if="!version.isValid && version.required" 
                id="version-help" class="p-error">Please input the version of the extension!</small>
            </div>
            
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-extension", "form-invalid"],
    props: ["edit", "trigger", "id", "initData"],
	data() {
		return {
            type: {
                val: 'extension-definition',
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
            created_by: {
                val: '',
                isValid: true,
                required: true
            },
            schema: {
                val: '',
                isValid: true,
                required: true
            },
            version: {
                val: '',
                isValid: true,
                required: true
            }
        };
	},
    computed: {
        key() { // the uuidv5 key is computed based on the properties of the obects
            const obj = {};
            
            if (this.type.isValid) obj['type'] = this.type.val;
            if (this.name.isValid) obj['name'] = this.name.val;
            if (this.description.isValid) obj['description'] = this.description.val;
            if (this.created_by.isValid) obj['created_by'] = this.created_by.val;
            if (this.schema.isValid) obj['schema'] = this.schema.val;
            if (this.version.isValid) obj['version'] = this.version.val;

            return this.$store.getters['uuid/uuidv5']('extension', obj);
        }
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
    created() {
        this.loadData();
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() { // loading data into the form
            if (this.initData) {
                if (this.initData.ret.type) this.type.val = this.initData.ret.type;
                if (this.initData.ret.name) this.name.val = this.initData.ret.name;
                if (this.initData.ret.description) this.description.val = this.initData.ret.description;
                if (this.initData.ret.created_by) this.created_by.val = this.initData.ret.created_by;
                if (this.initData.ret.schema) this.schema.val = this.initData.ret.schema;
                if (this.initData.ret.version) this.version.val = this.initData.ret.version;
            }
        },
        validateInputs() { // validate inputs of the form
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
            if(this.created_by.val == '') {
                this.created_by.isValid = false;
                dataValid = false;
            }
            if(this.schema.val == '') {
                this.schema.isValid = false;
                dataValid = false;
            }
            if(this.version.val == '') {
                this.version.isValid = false;
                dataValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // submitting data to parent form
            if(this.validateInputs()) {
                const ret = {};
                ret['key'] = this.key;
                if (this.type.isValid) ret['type'] = this.type.val;
                if (this.name.isValid) ret['name'] = this.name.val;
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.created_by.isValid) ret['created_by'] = this.created_by.val;
                if (this.schema.isValid) ret['schema'] = this.schema.val;
                if (this.version.isValid) ret['version'] = this.version.val;
                
                this.$emit("provide-extension", {
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