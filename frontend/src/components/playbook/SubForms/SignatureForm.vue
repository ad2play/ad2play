<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Sig ' + id}}</h5>

            <div class="p-field">
                <label for="type">Type*</label>
                <p>{{type}}</p>
            </div>

            <div class="p-field">
                <label for="spec_version">Spec version*</label>
                <p>{{spec_version}}</p>
            </div>

            <div class="p-field">
                <label for="identifier">ID*</label>
                <InputText id="identifier" :class="{'p-error': !identifier.isValid}" v-model.trim="identifier.val"
                @blur="clearValidity('identifier')" aria-describedby="identifier-help" v-tooltip.left="'Input field for the identifier of the signature.'"/>
                <small v-if="!identifier.isValid && identifier.required" 
                id="identifier-help" class="p-error">Please input the identifier of the signature!</small>
            </div>

            <div class="p-field">
                <label for="created_by">Created by</label>
                <InputText id="created_by" v-model.trim="created_by.val"
                @blur="clearValidity('created_by')" aria-describedby="created_by-help" v-tooltip.left="'Input field for the created_by of the signature.'"/>
                <small v-if="!created_by.isValid && created_by.required" 
                id="created_by-help" class="p-error">Please input the created_by of the signature!</small>
            </div>

            <div class="p-field">
                <label for="created">Created*</label>
                <Calendar 
                id="created"
                :showIcon="true"                        
                :yearNavigator="true"
                :yearRange="yearRange"
                v-model="created.val"
                @blur="clearValidity('created')" aria-describedby="created-help"
                v-tooltip.left="'Input the created date'"
                ></Calendar>
                <small v-if="!created.isValid && created.required" id="created-help" class="p-error">Please input the created date!</small>
            </div>

            <div class="p-field">
                <label for="modified">Modified*</label>
                <Calendar 
                id="modified"
                :showIcon="true"                        
                :yearNavigator="true"
                :yearRange="yearRange"
                v-model="modified.val"
                @blur="clearValidity('modified')" aria-describedby="modified-help"
                v-tooltip.left="'Input the modified date'"
                ></Calendar>
                <small v-if="!modified.isValid && modified.required" id="modified-help" class="p-error">Please input the modified date!</small>
            </div>

            <div class="p-field">
                <label for="signee">Signee*</label>
                <InputText id="signee" :class="{'p-error': !signee.isValid}" v-model.trim="signee.val"
                @blur="clearValidity('signee')" aria-describedby="signee-help" v-tooltip.left="'Input field for the signee of the signature.'"/>
                <small v-if="!signee.isValid && signee.required" 
                id="signee-help" class="p-error">Please input the signee of the signature!</small>
            </div>

            <div class="p-field">
                <label for="valid_from">Valid from</label>
                <Calendar 
                id="valid_from"
                :showIcon="true"                        
                :yearNavigator="true"
                :yearRange="yearRange"
                v-model="valid_from.val"
                @blur="clearValidity('valid_from')" aria-describedby="valid_from-help"
                v-tooltip.left="'Input the valid_from date'"
                ></Calendar>
                <small v-if="!valid_from.isValid && valid_from.required" id="valid_from-help" class="p-error">Please input the valid_from date!</small>
            </div>

            <div class="p-field">
                <label for="valid_until">Valid until</label>
                <Calendar 
                id="valid_until"
                :showIcon="true"                        
                :yearNavigator="true"
                :yearRange="yearRange"
                v-model="valid_until.val"
                @blur="clearValidity('valid_until')" aria-describedby="valid_until-help"
                v-tooltip.left="'Input the valid_until date'"
                ></Calendar>
                <small v-if="!valid_until.isValid && valid_until.required" id="valid_until-help" class="p-error">Please input the valid_until date!</small>
            </div>

            <div class="p-field">
                <label for="related_to">Related to*</label>
                <InputText id="related_to" :class="{'p-error': !related_to.isValid}" v-model.trim="related_to.val"
                @blur="clearValidity('related_to')" aria-describedby="related_to-help" v-tooltip.left="'Input field for the related_to of the signature.'"/>
                <small v-if="!related_to.isValid && related_to.required" 
                id="related_to-help" class="p-error">Please input the related_to identifier of the signature!</small>
            </div>

            <div class="p-field">
                <label for="sha256">SHA256*</label>
                <InputText id="sha256" :class="{'p-error': !sha256.isValid}" v-model.trim="sha256.val"
                @blur="clearValidity('sha256')" aria-describedby="sha256-help" v-tooltip.left="'Input field for the sha256 of the signature.'"/>
                <small v-if="!sha256.isValid && sha256.required" 
                id="sha256-help" class="p-error">Please input the sha256 of the signature!</small>
            </div>

            <div class="p-field">
                <label for="algorithm">Algorithm*</label>
                <Dropdown id="algorithm" :options="algorithmTypes" placeholder="Choose an algorithm"
                :class="{'p-error': !algorithm.isValid}"
                v-model="algorithm.val" @blur="clearValidity('algorithm')" aria-describedby="algorithm-help" 
                v-tooltip.left="'Please choose the algorithm of the signature.'"/>
                <small v-if="!algorithm.isValid && algorithm.required" id="algorithm-help" class="p-error">Please choose an algorithm!</small>
            </div>

            <div class="p-field">
                <label for="public_keys">Public keys</label>
                <InputText id="public_keys" v-model.trim="public_keys.val"
                @blur="clearValidity('public_keys')" aria-describedby="public_keys-help" v-tooltip.left="'Input field for the public keys as coma separated string'"/>
                <small v-if="!public_keys.isValid && public_keys.required" 
                id="public_keys-help" class="p-error">Please input the public keys as coma separated string!</small>
            </div>

            <div class="p-field">
                <label for="cert_url">CERT URL</label>
                <InputText id="cert_url" v-model.trim="cert_url.val"
                @blur="clearValidity('cert_url')" aria-describedby="cert_url-help" v-tooltip.left="'Input field for the cert_url of the signature'"/>
                <small v-if="!cert_url.isValid && cert_url.required" 
                id="cert_url-help" class="p-error">Please input the cert_url of the signature!</small>
            </div>

            <div class="p-field">
                <label for="thumbprint">Thumbprint</label>
                <InputText id="thumbprint" v-model.trim="thumbprint.val"
                @blur="clearValidity('thumbprint')" aria-describedby="thumbprint-help" v-tooltip.left="'Input field for the thumbprint of the signature'"/>
                <small v-if="!thumbprint.isValid && thumbprint.required" 
                id="thumbprint-help" class="p-error">Please input the thumbprint of the signature!</small>
            </div>

            <div class="p-field">
                <label for="value">Value*</label>
                <InputText id="value" :class="{'p-error': !value.isValid}" v-model.trim="value.val"
                @blur="clearValidity('value')" aria-describedby="value-help" v-tooltip.left="'Input field for the value of the signature.'"/>
                <small v-if="!value.isValid && value.required" 
                id="value-help" class="p-error">Please input the value of the signature!</small>
            </div>

            <div class="p-field">
                <h6 for="revoked">Revoked</h6>
                <InputSwitch id="revoked" v-model="revoked.val" v-tooltip.left="'Revoked value of the marking.'"/>
            </div>
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-signature"],
    props: ["edit", "trigger", "id", "initData"],
	data() {
		return {
            algorithmTypes: [ // enumerations to be CACAO compliant
                'RS256',
                'RS384',
                'RS512',
                'ES256',
                'ES384',
                'ES512',
                'PS256',
                'PS384',
                'PS512',
                'Ed25519',
                'Ed448'
            ],
            type: 'signature', // fixed values
            spec_version: '1.0', // fixed values
            identifier: {
                val: '',
                isValid: true,
                required: true
            },
            created_by: {
                val: '',
                isValid: true,
                required: false
            },
            created: {
                val: null,
                isValid: true,
                required: false
            },
            modified: {
                val: null,
                isValid: true,
                required: false
            },
            revoked: {
                val: false,
                isValid: true,
                required: false
            },
            signee: {
                val: '',
                isValid: true,
                required: false
            },
            valid_from: {
                val: false,
                isValid: true,
                required: false
            },
            valid_until: {
                val: false,
                isValid: true,
                required: false
            },
            related_to: {
                val: '',
                isValid: true,
                required: true
            },
            sha256: {
                val: '',
                isValid: true,
                required: true
            },
            algorithm: {
                val: '',
                isValid: true,
                required: true
            },
            public_keys: {
                val: '',
                isValid: true,
                required: false
            },
            cert_url: {
                val: '',
                isValid: true,
                required: false
            },
            thumbprint: {
                val: '',
                isValid: true,
                required: false
            },
            value: {
                val: '',
                isValid: true,
                required: true
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
    computed: {
        yearRange() { // year range for the calendar input types
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
        loadData() { // when an existing playbook is altered the data is loaded by this method
            if (this.initData) {
                if (this.initData.id) this.identifier.val = this.initData.id;
                if (this.initData.created_by) this.created_by.val = this.initData.created_by;
                if (this.initData.created) this.created.val = new Date(this.initData.created);
                if (this.initData.modified) this.modified.val = new Date(this.initData.modified);
                if (this.initData.revoked !== null) this.revoked.val = this.initData.revoked;
                if (this.initData.signee) this.signee.val = this.initData.signee;
                if (this.initData.valid_from) this.valid_from.val = new Date(this.initData.valid_from);
                if (this.initData.valid_until) this.valid_until.val = new Date(this.initData.valid_until);
                if (this.initData.related_to) this.related_to.val = this.initData.related_to;
                if (this.initData.sha256) this.sha256.val = this.initData.sha256;
                if (this.initData.algorithm) this.algorithm.val = this.initData.algorithm;
                if (this.initData.public_keys) this.public_keys.val = this.initData.public_keys.toString();
                if (this.initData.cert_url) this.cert_url.val = this.initData.cert_url;
                if (this.initData.thumbprint) this.thumbprint.val = this.initData.thumbprint;
                if (this.initData.value) this.value.val = this.initData.value;
            }
        },
        validateInputs() {
            var dataValid = true;
            if(this.identifier.val == '') {
                this.identifier.isValid = false;
                dataValid = false;
            }
            if(this.created_by.val == '') {
                this.created_by.isValid = false;
            }
            if(this.created.val == null) {
                this.created.isValid = false;
                dataValid = false;
            }
            if(this.modified.val == null) {
                this.modified.isValid = false;
                dataValid = false;
            }
            if(this.signee.val == null) {
                this.signee.isValid = false;
                dataValid = false;
            }
            if(this.valid_from.val == null) {
                this.valid_from.isValid = false;
                dataValid = false;
            }
            if(this.valid_until.val == null) {
                this.valid_until.isValid = false;
                dataValid = false;
            }
            if(this.related_to.val == '') {
                this.related_to.isValid = false;
                dataValid = false;
            }
            if(this.sha256.val == '') {
                this.sha256.isValid = false;
                dataValid = false;
            }
            if(this.algorithm.val == '') {
                this.algorithm.isValid = false;
                dataValid = false;
            }
            if(this.public_keys.val == '') {
                this.public_keys.isValid = false;
            }
            if(this.cert_url.val == '') {
                this.cert_url.isValid = false;
            }
            if(this.thumbprint.val == '') {
                this.thumbprint.isValid = false;
            }
            if(this.value.val == '') {
                this.value.isValid = false;
                dataValid = false;
            }

            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // submitting mehtod for the whole form
            if(this.validateInputs()) {
                const ret = {};
                ret['type'] = this.type;
                ret['spec_version'] = this.spec_version;
                if (this.identifier.isValid) ret['id'] = this.identifier.val;
                if (this.created_by.isValid) ret['created_by'] = this.created_by.val;
                if (this.created.isValid) ret['created'] = new Date(this.created.val).toISOString();
                if (this.modified.isValid) ret['modified'] = new Date(this.modified.val).toISOString();
                ret['revoked'] = this.revoked.val;
                if (this.signee.isValid) ret['signee'] = this.signee.val;
                if (this.valid_from.isValid) ret['valid_from'] = new Date(this.valid_from.val).toISOString();
                if (this.valid_until.isValid) ret['valid_until'] = new Date(this.valid_until.val).toISOString();
                if (this.related_to.isValid) ret['related_to'] = this.related_to.val;
                if (this.sha256.isValid) ret['sha256'] = this.sha256.val;
                if (this.algorithm.isValid) ret['algorithm'] = this.algorithm.val;
                if (this.public_keys.isValid) ret['public_keys'] = this.public_keys.val.split(',').filter(function (el) {return el !== '';});
                if (this.cert_url.isValid) ret['cert_url'] = this.cert_url.val;
                if (this.thumbprint.isValid) ret['thumbprint'] = this.thumbprint.val;
                if (this.value.isValid) ret['value'] = this.value.val;
                
                this.$emit("provide-signature", {
                    ret: ret,
                    index: this.id
                });                               
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