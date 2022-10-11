<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Tel ' + id}}</h5>
            <div class="p-field">
                <label for="key">Key</label>
                <InputText id="key" :class="{'p-error': !key.isValid}" v-model.trim="key.val"
                @blur="clearValidity('key')" aria-describedby="key-help" v-tooltip.left="'Input field for the key of the number.'"/>
                <small v-if="!key.isValid && key.required" id="key-help" class="p-error">Please input the key of the number!</small>
            </div>

            <div class="p-field">
                <label for="phone">Phone Number</label>
                <InputText id="phone" :class="{'p-error': !phone.isValid}" v-model.trim="phone.val"
                @blur="clearValidity('phone')" aria-describedby="phone-help" v-tooltip.left="'Input field for the phone number.'"/>
                <small v-if="!phone.isValid && phone.required" 
                id="phone-help" class="p-error">Please input the phone number!</small>
            </div>
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-phone", "form-invalid"],
    props: ["edit", "trigger", "id", "initData"],
	data() {
		return {
            key: {
                val: '',
                isValid: true,
                required: false
            },
            phone: {
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
        loadData() {
            if (this.initData) {
                if (this.initData.key) this.key.val = this.initData.key;
                if (this.initData.ret) this.phone.val = this.initData.ret;
            }
        },
        validateInputs() {
            var dataValid = true;
            if(this.key.val == '') {
                this.key.isValid = false;
                dataValid = false;
            }
            if(this.phone.val == '') {
                this.phone.isValid = false;
                dataValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){
            if(this.validateInputs()) {
                const ret = {};
                if (this.key.isValid) ret['key'] = this.key.val;
                if (this.phone.isValid) ret['phone'] = this.phone.val;
                this.$emit("provide-phone", {
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