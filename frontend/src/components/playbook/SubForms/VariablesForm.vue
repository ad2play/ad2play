// form component for the variables of the playbook
<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Var ' + id}}</h5>

            <div class="p-field">
                <label for="key">KEY*</label>
                <InputText id="key" :class="{'p-error': !key.isValid}" v-model.trim="key.val"
                @blur="clearValidity('key')" aria-describedby="key-help" v-tooltip.left="'Input field for the key of the variable.'"/>
                <small v-if="!key.isValid && key.required" id="key-help" class="p-error">Please input the key that references this variable!</small>
            </div>

            <div class="p-field">
                <label for="type">Type*</label>
                <Dropdown id="type" :options="variableTypes" placeholder="Choose Type" 
                :class="{'p-error': !type.isValid}"
                v-model="type.val" @blur="clearValidity('type')" aria-describedby="type-help" 
                v-tooltip.left="'Please choose the type of the variable.'"/>
                <small v-if="!type.isValid && type.required" id="type-help" class="p-error">Please choose a type!</small>
            </div>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the variable.'"/>
                <small v-if="!description.isValid && description.required" 
                id="description-help" class="p-error">Please input the description of the variable!</small>
            </div>

            <div class="p-field">
                <label for="value">Value</label>
                <InputText id="value" v-model.trim="value.val"
                @blur="clearValidity('value')" aria-describedby="value-help" v-tooltip.left="'Input field for the value of the variable.'"/>
                <small v-if="!value.isValid && value.required" 
                id="value-help" class="p-error">Please input the value of the variable!</small>
            </div>

            <div class="p-field">
                <h6 for="revoked">Constant</h6>
                <InputSwitch id="revoked" v-model="constant.val" v-tooltip.left="'Switch to activate if the variable is a constant.'"/>
            </div>

            <div class="p-field">
                <h6 for="revoked">External</h6>
                <InputSwitch id="revoked" v-model="external.val" v-tooltip.left="'Switch to declare if the variable is external.'"/>
            </div>
            
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-variables", "form-invalid"],
    props: ["edit", "trigger", "id", "initData"],
	data() {
		return {
            variableTypes: [
                'string',
                'uuid',
                'integer',
                'long',
                'mac-addr',
                'ipv4-addr',
                'ipv6-addr',
                'uri',
                'sha256-hash',
                'hexstring',
                'dictionary',
            ],
            key: {
                val: '',
                isValid: true,
                required: true
            },
            type: {
                val: '',
                isValid: true,
                required: true
            },
            description: {
                val: '',
                isValid: true,
                required: false
            },
            value: {
                val: '',
                isValid: true,
                required: false
            },
            constant: {
                val: false,
                isValid: true,
                required: false
            },
            external: {
                val: false,
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
        loadData() {
            if (this.initData) { // when an existing playbook is edited the date for the fields is loaded in this function
                if (this.initData.key) this.key.val = this.initData.key;
                if (this.initData.ret.type) this.type.val = this.initData.ret.type;
                if (this.initData.ret.description) this.description.val = this.initData.ret.description;
                if (this.initData.ret.value) this.value.val = this.initData.ret.value;
                if (this.initData.ret.constant) if (this.initData.ret.constant !== null) this.constant.val = this.initData.ret.constant;
                if (this.initData.ret.external) if (this.initData.ret.external !== null) this.external.val = this.initData.ret.external;
            }
        },
        getKey() { // puts the input for the key in square brackets to avoid errors with starting character $ in the database
            let key = this.key.val;
            if (!key.startsWith('[')) {
                key = '[' + key;
            }
            if (!key.endsWith(']')) {
                key = key + ']';
            }
            return key;
        },
        validateInputs() { // input validation
            var dataValid = true;
            if(this.key.val == '') {
                this.key.isValid = false;
                dataValid = false;
            }
            if(this.type.val == '') {
                this.type.isValid = false;
                dataValid = false;
            }
            if(this.description.val == '') {
                this.description.isValid = false;
            }
            if(this.value.val == '') {
                this.value.isValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){
            if(this.validateInputs()) {
                const ret = {};
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.value.isValid) ret['value'] = this.value.val;
                if (this.constant.isValid) ret['constant'] = this.constant.val;
                if (this.external.isValid) ret['external'] = this.external.val;
                if (this.type.isValid) ret['type'] = this.type.val;
                if (this.key.isValid) ret['key'] = this.getKey();

                this.$emit("provide-variables", { // emits the input data to the parent form
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