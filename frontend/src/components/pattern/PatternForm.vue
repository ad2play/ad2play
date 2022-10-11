// subcomponent for providing the form for creting and editing pattern documents
<template>
        <div class="card p-fluid major-card">
            <h1>Pattern Form</h1>

            <div class="p-field">
                <label for="name">Name*</label>
                <InputText id="name" :class="{'p-error': !name.isValid}" v-model.trim="name.val"
                @blur="clearValidity('name')" aria-describedby="name-help" v-tooltip.left="'Input field for the name of the pattern.'"/>
                <small v-if="!name.isValid && name.required" id="name-help" class="p-error">Please input the name of the pattern!</small>
            </div>

            <div class="p-field">
                <label for="description">Description*</label>
                <InputText id="description" :class="{'p-error': !description.isValid}" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the pattern.'"/>
                <small v-if="!description.isValid && description.required" id="description-help" class="p-error">Please input the description of the pattern!</small>
            </div>

            <div class="card p-fluid">
                <div>
                    <h4>Matching Terms</h4>
                    <div v-for="index in layerCounter" :key="index">
                        <div class="p-field">
                            <label for="layer">{{(index) + '*'}}</label>
                            <InputText id="layer" v-model.trim="matchingterms[index - 1]" v-tooltip.left="'Input field for comma separated matching terms of the layer.'"/>
                        </div>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="layerCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="deleteLastTerm" v-if="layerCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <div class="card p-fluid">
                <div>
                    <h4>Workflow Step</h4>
                    <div v-for="index in workflowCounter" :key="index">
                        <WorkflowStepForm @provide-workflowstep="setWorkflow" @form-invalid="invalidToast" :trigger="trigger" :id="index" :nbr="workflowCounter" :initData="getInitData(initWorkflowdata, index)"></WorkflowStepForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="workflowCounter += 1" v-if="workflowCounter === 0">Add Layer</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="workflowCounter -= 1" v-if="workflowCounter > 0">Delete Last Layer</Button>
                    </div>
                    
                </div>
            </div>


            <div class="card p-fluid">
                <div class="p-field">
                    <Button label="Submit" type="submit" v-tooltip.left="'Submit Form.'" @click="triggerSubForms"></Button>
                </div>
            </div>
        </div>
</template>

<script>
import WorkflowStepForm from '../playbook/SubForms/WorkflowStepForm.vue';

export default {
    emits: ["pattern-submit"],
    props: ["submitLabel", "editId"],
    components: {
        WorkflowStepForm
    },
	data() {
		return {
            workflowStep: null,
            workflowCounter: 0,
            workflowEmitted: false,
            workflowEmittedCounter : 0,
            layerCounter: 0,
            matchingterms : [],
            subFormsEmitted: false,
            initWorkflowdata: null,
            trigger: 0,
            name: {
                val: '',
                isValid: true,
                required: true
            },
            description: {
                val: '',
                isValid: true,
                required: true
            },
        };
	},
    watch: {
        subFormsEmitted: function(newVal) {  // this form has further subforms that must send their data at first before the overall form can be submitted
            if (newVal) {
                this.submitForm();
            }
        },
        '$route': 'loadData'
    },
    created() {
        this.loadData();
    },
    methods: {
        deleteLastTerm() {
            this.layerCounter -= 1;
            this.matchingterms.pop();
        },
        invalidToast() {
            this.$toast.add({severity:'error', summary: 'Form invalid! Playse fill the mandatory fields with the proper data', life: 3000});
        },
        async loadData() { // for the case that a pattern is edited this method loads the data of the pattern to fill in the form in the beginnning
            if (this.editId) {
                await this.$store.dispatch('pattern/get', {_id: this.editId});
                var pattern = this.$store.getters['pattern/getById'](this.editId);
                if (pattern) {                    
                    if (pattern.name) this.name.val = pattern.name;                    
                    if (pattern.description) this.description.val = pattern.description;

                    this.matchingterms = [];
                    this.layerCounter = pattern.matching_terms.length;
                    if (pattern.matching_terms.length !== 0) {
                        for (const lay of pattern.matching_terms) {
                            this.matchingterms.push(lay.toString());
                        }
                    }
                    if (pattern.workflow_step) {
                        this.initWorkflowdata = [
                            {
                                ret : pattern.workflow_step,
                                index: 1
                            }
                        ];
                        this.workflowCounter = this.initWorkflowdata.length
                    }
                }    
            }
        },
        // mapStepIdsToData(steps) {
        //     let count = 1;
        //     const ret = {};
        //     for (const key in steps) {
        //         ret[key] = count;
        //         count++;
        //     }

        //     for (const item of this.initWorkflowdata) {
        //         item['stepMapping'] = ret;
        //     }
        // },
        getInitData(data, index) { // method that returns the initializing data for the workflow step form in the case a pattern is edited
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
        triggerSubForms() { // method that triggers all subforms by altering the trigger (which is given as props to each subform)
            this.trigger += 1;
            this.checkSubEmits();
        },
        setWorkflow(event) { // method that saves the results from the workflow form 
            const step = event.ret;
            delete step.key;
            this.workflowStep = step;

            this.workflowEmittedCounter += 1;
            if (this.workflowEmittedCounter === this.workflowCounter) {
                this.workflowEmitted = true;
            }
            this.checkSubEmits();
        },
        validateInputs() { // validation method for checking the inputs
            var dataValid = true;
            if(this.name.val == '') {
                this.name.isValid = false;
                dataValid = false;
            }
            if(this.description.val == '') {
                this.description.isValid = false;
                dataValid = false;
            }
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm() { // submit method that submits the form (is only called when all subforms submitted in advance)
            this.workflowEmittedCounter = 0;
            this.workflowEmitted = false;
            this.subFormsEmitted = false;

            if(this.validateInputs()) {
                const ret = {};
                if (this.name.isValid) ret['name'] = this.name.val;
                if (this.description.isValid) ret['description'] = this.description.val;

                const terms = [];
                if (this.layerCounter !== 0) {
                    if (this.matchingterms.length !== 0) {
                        for (const lay of this.matchingterms) {
                            const splitted = lay.split(',');
                            const filtered = splitted.filter(function (el) {
                                return el !== '';
                            });
                            terms.push(filtered);
                        }
                    }
                    ret['matching_terms'] = terms;
                }
                if (this.workflowStep) ret['workflow_step'] = this.workflowStep;

                this.$emit("pattern-submit", ret); // the data is sent to the parent component, where it is handled                            
            }

            this.workflowStep = null;
        },
        checkSubEmits() {

            if (this.workflowCounter === 0) {
                this.workflowEmitted = true;
            }
            if (this.workflowEmitted) {
                this.subFormsEmitted = true;
            }
        }
    }	
}
</script>