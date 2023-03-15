<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5 v-if="!noId">{{'Con ' + id}}</h5>

            <div class="p-field">
                <label for="email">E-Mail</label>
                <InputText id="email" v-model.trim="email.val"
                @blur="clearValidity('email')" aria-describedby="email-help" v-tooltip.left="'Input field for the email of the contact.'"/>
                <small v-if="!email.isValid && email.required" id="email-help" class="p-error">Please input the email of the contact!</small>
            </div>

            <div class="p-field">
                <label for="contact_details">Contact details</label>
                <InputText id="contact_details" v-model.trim="contact_details.val"
                @blur="clearValidity('contact_details')" aria-describedby="contact_details-help" v-tooltip.left="'Input field for the contact_details of the contact.'"/>
                <small v-if="!contact_details.isValid && contact_details.required" 
                id="contact_details-help" class="p-error">Please input the contact_details of the contact!</small>
            </div>

            <div class="card p-fluid">
                <div>
                    <h4>Phone Numbers</h4>
                    <div v-for="index in phoneCounter" :key="index">
                        <PhoneForm @provide-phone="setPhones" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initPhone, index)"></PhoneForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="phoneCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="phoneCounter -= 1" v-if="phoneCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </form>
</template>

<script>
import PhoneForm from './PhoneForm.vue';

export default {
    emits: ["provide-contact", "form-invalid"],
    props: ["edit", "trigger", "id", "noId", "initData"],
    components: {
        PhoneForm
    },
	data() {
		return {
            phoneCounter: 0,
            phone: [],
            phoneFormEmittedCounter: 0,
            phoneFormEmitted: false,
            initPhone: null,
            email: {
                val: '',
                isValid: true,
                required: false
            },
            contact_details: {
                val: '',
                isValid: true,
                required: false
            }
        };
	},
    watch: {
        phoneFormEmitted: function(newVal) {
            if (newVal) {
                this.submitForm();
            }
        },
        trigger: function() {
            if (this.phoneCounter === 0) {
                this.submitForm();
            }
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
        loadData() { // load data into the form
            if (this.initData) {
                if (this.initData.email) this.email.val = this.initData.email;
                if (this.initData.contact_details) this.contact_details.val = this.initData.contact_details;

                if (this.initData.phone) {
                    this.initPhone = this.$store.getters['help/reverseDictionary'](this.initData.phone);
                    this.phoneCounter = this.initPhone.length
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
        setPhones (event) {
            this.phone.push(event);

            this.phoneFormEmittedCounter += 1;
            if (this.phoneFormEmittedCounter === this.phoneCounter) {
                this.phoneFormEmitted = true;
            }            
        },
        validateInputs() { // validate inputs of the fields
            var dataValid = true;
            if(this.email.val == '') {
                this.email.isValid = false;
            }
            if(this.contact_details.val == '') {
                this.contact_details.isValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // submits the formdata
            this.phoneFormEmittedCounter = 0;
            this.phoneFormEmitted = false;

            if(this.validateInputs()) {
                const ret = {};
                if (this.email.isValid) ret['email'] = this.email.val;
                if (this.contact_details.isValid) ret['contact_details'] = this.contact_details.val;
                if (Object.keys(this.phone).length !== 0) ret['phone'] = this.getPhoneFormat();
                this.$emit("provide-contact", {
                    ret: ret,
                    index: this.id
                });                               
            } else {
                this.$emit("form-invalid");
            }
        },
        emitInvalidity() {
            this.$emit("form-invalid");
        },
        getPhoneFormat() { // helping method that returns the data in the correct format before submitting it
            const res = this.phone;
            const ret = {};
            const idxs = [];
            for (const r in res) {
                if (!idxs.includes(res[r].index)) {
                    idxs.push(res[r].index)
                    ret[res[r].ret.key.toString()] = res[r].ret.phone;
                }
            }
            return ret;
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