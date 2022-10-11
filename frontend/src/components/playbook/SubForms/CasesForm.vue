<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Case ' + id}}</h5>
            <div class="p-field">
                <label for="caseVal">Case*</label>
                <InputText id="caseVal" v-model.trim="caseVal.val"
                @blur="clearValidity('caseVal')" aria-describedby="caseVal-help" v-tooltip.left="'Input field for the case of the case.'"/>
                <small v-if="!caseVal.isValid && caseVal.required" id="caseVal-help" class="p-error">Please input the case of the case!</small>
            </div>

            <div class="p-field">
                <label for="steps">Steps*</label>
                <MultiSelect  id="steps" :options="stepsOpt" v-model="steps.val"
                @blur="clearValidity('steps')" aria-describedby="steps-help" v-tooltip.left="'Selection field for the steps.'"
                placeholder="Choose steps for case"/>
                <small v-if="!steps.isValid && steps.required" 
                id="steps-help" class="p-error">Please select the steps for the case!</small>
            </div>
        </div>
    </form>
</template>

<script>

export default {
    emits: ["provide-case", "form-invalid"],
    props: ["edit", "trigger", "id", "nbr", "initData"],
	data() {
		return {
            caseVal: {
                val: '',
                isValid: true,
                required: true
            },
            steps: {
                val: null,
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
    created() {
        this.loadData();
    },
    computed: {
        stepsOpt() { // method that retuns the possible values for choosing the step numbers
            const steps = this.nbr;
            const ret = [];
            for (let i = 1; i <= steps; i++) {
                ret.push(i)
            }
            return ret;
        }
    },
    methods: {
        loadData() { // lads existing data into the form fields
            if (this.initData) {
                if (this.initData.key) this.caseVal.val = this.initData.key;
                if (this.initData.ret) this.steps.val = this.initData.ret;
            }
        },
        validateInputs() { // validates inputs of the form
            var dataValid = true;
            if(this.caseVal.val == '') {
                this.caseVal.isValid = false;
                dataValid = false;
            }
            if(this.steps.val == '') {
                this.steps.isValid = false;
                dataValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // submits the data of the form to the parent form
            if(this.validateInputs()) {
                const ret = {};
                if (this.caseVal.isValid) ret['key'] = this.caseVal.val;
                if (this.steps.isValid) ret['steps'] = this.steps.val;
                this.$emit("provide-case", {
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