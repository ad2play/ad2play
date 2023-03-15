<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Cmd ' + id}}</h5>

            <div class="p-field">
                <label for="type">Type*</label>
                <Dropdown id="type" :options="cmdTypes" placeholder="Choose Type"
                :class="{'p-error': !type.isValid}"
                v-model="type.val" @blur="clearValidity('type')" aria-describedby="type-help" 
                v-tooltip.left="'Please choose the type of the workflow step.'"/>
                <small v-if="!type.isValid && type.required" id="type-help" class="p-error">Please choose a type!</small>
            </div>

            <div class="p-field">
                <label for="command">Command</label>
                <InputText id="command" v-model.trim="command.val"
                @blur="clearValidity('command')" aria-describedby="command-help" v-tooltip.left="'Input field for the command of the command.'"/>
                <small v-if="!command.isValid && command.required" 
                id="command-help" class="p-error">Please input the command of the command!</small>
            </div>

            <div class="p-field">
                <label for="command_b64">Command B64</label>
                <InputText id="command_b64" v-model.trim="command_b64.val"
                @blur="clearValidity('command_b64')" aria-describedby="command_b64-help" v-tooltip.left="'Input field for the command_b64 of the command.'"/>
                <small v-if="!command_b64.isValid && command_b64.required" 
                id="command_b64-help" class="p-error">Please input the command_b64 of the command!</small>
            </div>

            <div class="p-field">
                <label for="version">Version</label>
                <InputText id="version" v-model.trim="version.val"
                @blur="clearValidity('version')" aria-describedby="version-help" v-tooltip.left="'Input field for the version of the command.'"/>
                <small v-if="!version.isValid && version.required" 
                id="version-help" class="p-error">Please input the version of the command!</small>
            </div>
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-command", "form-invalid"],
    props: ["edit", "trigger", "id", "initData"],
	data() {
		return {
            cmdTypes: [ // enumerations to be compliant to CACAO
                'manual',
                'http-api',
                'ssh',
                'bash',
                'openc2-json',
                'attack-cmd'
            ],
            type: {
                val: '',
                isValid: true,
                required: true
            },
            command: {
                val: '',
                isValid: true,
                required: false
            },
            command_b64: {
                val: '',
                isValid: true,
                required: false
            },
            version: {
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
    methods: {
        loadData() { // loading existing data into the form fields
            if (this.initData) {
                if (this.initData.type) this.type.val = this.initData.type;
                if (this.initData.command) this.command.val = this.initData.command;
                if (this.initData.command_b64) this.command_b64.val = this.initData.command_b64;
                if (this.initData.version) this.version.val = this.initData.version;
            }
        },
        validateInputs() {
            var dataValid = true;
            if(this.type.val == '') {
                this.type.isValid = false;
                dataValid = false;
            }
            if(this.command.val == '') {
                this.command.isValid = false;
            }
            if(this.command_b64.val == '') {
                this.command_b64.isValid = false;
            }
            if(this.version.val == '') {
                this.version.isValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // submits the data to the parent form
            if(this.validateInputs()) {
                const ret = {};
                if (this.type.isValid) ret['type'] = this.type.val;
                if (this.command.isValid) ret['command'] = this.command.val;
                if (this.command_b64.isValid) ret['command_b64'] = this.command_b64.val;
                if (this.version.isValid) ret['version'] = this.version.val;

                this.$emit("provide-command", {
                    ret: ret,
                    index: this.id
                });                               
            } else {
                this.$emit("form-invalid")
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