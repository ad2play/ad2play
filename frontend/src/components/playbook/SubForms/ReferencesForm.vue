<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Ref ' + id}}</h5>
            <div class="p-field">
                <label for="name">Name*</label>
                <InputText id="name" :class="{'p-error': !name.isValid}" v-model.trim="name.val"
                @blur="clearValidity('name')" aria-describedby="name-help" v-tooltip.left="'Input field for the name of the reference.'"/>
                <small v-if="!name.isValid && name.required" id="name-help" class="p-error">Please input the name of the reference!</small>
            </div>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the reference.'"/>
                <small v-if="!description.isValid && description.required" 
                id="description-help" class="p-error">Please input the description of the reference!</small>
            </div>

            <div class="p-field">
                <label for="source">Source</label>
                <InputText id="source" v-model.trim="source.val"
                @blur="clearValidity('source')" aria-describedby="source-help" v-tooltip.left="'Input field for the source of the reference.'"/>
                <small v-if="!source.isValid && source.required" 
                id="source-help" class="p-error">Please input the source of the reference!</small>
            </div>

            <div class="p-field">
                <label for="url">URL</label>
                <InputText id="url" v-model.trim="url.val"
                @blur="clearValidity('url')" aria-describedby="url-help" v-tooltip.left="'Input field for the url of the reference.'"/>
                <small v-if="!url.isValid && url.required" 
                id="url-help" class="p-error">Please input the url of the reference!</small>
            </div>

            <div class="p-field">
                <label for="external_id">External ID</label>
                <InputText id="external_id" v-model.trim="external_id.val"
                @blur="clearValidity('external_id')" aria-describedby="external_id-help" v-tooltip.left="'Input field for the external_id of the reference.'"/>
                <small v-if="!external_id.isValid && external_id.required" 
                id="external_id-help" class="p-error">Please input the external_id of the reference!</small>
            </div>

            <div class="p-field">
                <label for="reference_id">Reference ID</label>
                <InputText id="reference_id" v-model.trim="reference_id.val"
                @blur="clearValidity('reference_id')" aria-describedby="reference_id-help" v-tooltip.left="'Input field for the reference_id of the reference.'"/>
                <small v-if="!reference_id.isValid && reference_id.required" 
                id="reference_id-help" class="p-error">Please input the reference_id of the reference!</small>
            </div>
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-references", "form-invalid"],
    props: ["edit", "trigger", "id", "initData"],
	data() {
		return {
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
            source: {
                val: '',
                isValid: true,
                required: false
            },
            url: {
                val: '',
                isValid: true,
                required: false
            },
            external_id: {
                val: '',
                isValid: true,
                required: false
            },
            reference_id: {
                val: '',
                isValid: true,
                required: false
            }
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
    created() {
        this.loadData();
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() { // when an existing playbook is altered the data is loaded by this method
            if (this.initData) {
                if (this.initData.name) this.name.val = this.initData.name;
                if (this.initData.description) this.description.val = this.initData.description;
                if (this.initData.source) this.source.val = this.initData.source;
                if (this.initData.url) this.url.val = this.initData.url;
                if (this.initData.external_id) this.external_id.val = this.initData.external_id;
                if (this.initData.reference_id) this.reference_id.val = this.initData.reference_id;
            }
        },
        validateInputs() {
            var dataValid = true;
            if(this.name.val == '') {
                this.name.isValid = false;
                dataValid = false;
            }
            if(this.description.val == '') {
                this.description.isValid = false;
            }
            if(this.source.val == null) {
                this.source.isValid = false;
            }
            if(this.url.val == '') {
                this.url.isValid = false;
            }
            if(this.external_id.val == null) {
                this.external_id.isValid = false;
            }
            if(this.reference_id.val == null) {
                this.reference_id.isValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // method for submitting the data to the parent form
            if(this.validateInputs()) {
                const ret = {};
                if (this.name.isValid) ret['name'] = this.name.val;
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.source.isValid) ret['source'] = this.source.val;
                if (this.url.isValid) ret['url'] = this.url.val;
                if (this.external_id.isValid) ret['external_id'] = this.external_id.val;
                if (this.reference_id.isValid) ret['reference_id'] = this.reference_id.val;
                this.$emit("provide-references", {
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