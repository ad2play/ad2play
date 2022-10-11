// form component for dynamically create a CACAO workflow step
// does also use subforms to reduce complexity
<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5>{{'Step ' + id}}</h5>

            <div class="p-field">
                <label for="key">KEY*</label>
                <p>{{key}}</p>
            </div>

            <div class="p-field">
                <label for="type">Type*</label>
                <Dropdown id="type" :options="workflowStepType" placeholder="Choose Type" @change="resetForm"
                :class="{'p-error': !type.isValid}"
                v-model="type.val" @blur="clearValidity('type')" aria-describedby="type-help" 
                v-tooltip.left="'Please choose the type of the workflow step.'"/>
                <small v-if="!type.isValid && type.required" id="type-help" class="p-error">Please choose a type!</small>
            </div>

            <div class="p-field">
                <label for="name">Name</label>
                <InputText id="name" v-model.trim="name.val"
                @blur="clearValidity('name')" aria-describedby="name-help" v-tooltip.left="'Input field for the name of the workflow step.'"/>
                <small v-if="!name.isValid && name.required" 
                id="name-help" class="p-error">Please input the name of the workflow step!</small>
            </div>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the workflow step.'"/>
                <small v-if="!description.isValid && description.required" 
                id="description-help" class="p-error">Please input the description of the workflow step!</small>
            </div>

            <div class="p-field">
                <label for="delay">Delay</label>
                <InputNumber id="delay" locale="de" :maxFractionDigits="0" :minFractionDigits="0" :step="1" showButtons
                v-model="delay.val" @blur="clearValidity('delay')" aria-describedby="delay-help" 
                v-tooltip.left="'Input field for the delay of the workflow step'"/>
                <small v-if="!delay.isValid && delay.required" id="delay-help" class="p-error">Please input the delay of the workflow step!</small>
            </div>

            <div class="p-field">
                <label for="timeout">Timeout</label>
                <InputNumber id="timeout" locale="de" :maxFractionDigits="0" :minFractionDigits="0" :step="1" showButtons
                v-model="timeout.val" @blur="clearValidity('timeout')" aria-describedby="timeout-help" 
                v-tooltip.left="'Input field for the timeout of the workflow step'"/>
                <small v-if="!timeout.isValid && timeout.required" id="timeout-help" class="p-error">Please input the timeout of the workflow step!</small>
            </div>

            <div class="p-field">
                <label for="owner">Owner</label>
                <InputText id="owner" v-model.trim="owner.val"
                @blur="clearValidity('owner')" aria-describedby="owner-help" v-tooltip.left="'Input field for the owner of the workflow step.'"/>
                <small v-if="!owner.isValid && owner.required" 
                id="owner-help" class="p-error">Please input the owner of the workflow step!</small>
            </div>

            <div class="p-field">
                <label for="on_completion">On completion</label>
                <Dropdown id="on_completion" :options="steps" placeholder="Choose Step"
                v-model="on_completion.val" @blur="clearValidity('on_completion')" aria-describedby="on_completion-help" 
                v-tooltip.left="'Please choose the on_completion step of the workflow step.'"/>
                <small v-if="!on_completion.isValid && on_completion.required" id="on_completion-help" class="p-error">Please choose a step for on_completion!</small>
            </div>

            <div class="p-field">
                <label for="on_success">On success</label>
                <Dropdown id="on_success" :options="steps" placeholder="Choose Step"
                v-model="on_success.val" @blur="clearValidity('on_success')" aria-describedby="on_success-help" 
                v-tooltip.left="'Please choose the on_success step of the workflow step.'"/>
                <small v-if="!on_success.isValid && on_success.required" id="on_success-help" class="p-error">Please choose a step for on_success!</small>
            </div>

            <div class="p-field">
                <label for="on_failure">On failure</label>
                <Dropdown id="on_failure" :options="steps" placeholder="Choose Step"
                v-model="on_failure.val" @blur="clearValidity('on_failure')" aria-describedby="on_failure-help" 
                v-tooltip.left="'Please choose the on_failure step of the workflow step.'"/>
                <small v-if="!on_failure.isValid && on_failure.required" id="on_failure-help" class="p-error">Please choose a step for on_failure!</small>
            </div>

            <div class="p-field" v-if="['single'].includes(type.val)">
                <label for="target_ids">Target IDs</label>
                <InputText id="target_ids" v-model.trim="target_ids.val"
                @blur="clearValidity('target_ids')" aria-describedby="target_ids-help" v-tooltip.left="'Input field for the comma separated values target_ids of the workflow step.'"/>
                <small v-if="!target_ids.isValid && target_ids.required" 
                id="target_ids-help" class="p-error">Please input the target_ids of the workflow step!</small>
            </div>

            <div class="p-field" v-if="['single'].includes(type.val)">
                <label for="in_args">In args</label>
                <InputText id="in_args" v-model.trim="in_args.val"
                @blur="clearValidity('in_args')" aria-describedby="in_args-help" v-tooltip.left="'Input field for the comma separated values in_args of the workflow step.'"/>
                <small v-if="!in_args.isValid && in_args.required" 
                id="in_args-help" class="p-error">Please input the in_args of the workflow step!</small>
            </div>

            <div class="p-field" v-if="['single'].includes(type.val)">
                <label for="out_args">Out args</label>
                <InputText id="out_args" v-model.trim="out_args.val"
                @blur="clearValidity('out_args')" aria-describedby="out_args-help" v-tooltip.left="'Input field for comma separated values the out_args of the workflow step.'"/>
                <small v-if="!out_args.isValid && out_args.required" 
                id="out_args-help" class="p-error">Please input the out_args of the workflow step!</small>
            </div>

            <div class="p-field" v-if="['playbook'].includes(type.val)">
                <label for="playbook_id">Playbook ID*</label>
                <InputText id="playbook_id" v-model.trim="playbook_id.val"
                @blur="clearValidity('playbook_id')" aria-describedby="playbook_id-help" v-tooltip.left="'Input field for the playbook_id of the workflow step.'"/>
                <small v-if="!playbook_id.isValid && playbook_id.required" 
                id="playbook_id-help" class="p-error">Please input the playbook_id of the workflow step!</small>
            </div>

            <div class="p-field" v-if="['parallel'].includes(type.val)">
                <label for="next_steps">Next steps*</label>
                <MultiSelect  id="next_steps" :options="steps" v-model="next_steps.val"
                @blur="clearValidity('next_steps')" aria-describedby="next_steps-help" v-tooltip.left="'Selection field for playbook types.'"
                placeholder="Choose steps next_steps"/>
                <small v-if="!next_steps.isValid && next_steps.required" 
                id="next_steps-help" class="p-error">Please select the steps for the next_steps property!</small>
            </div>

            <div class="p-field" v-if="['if-condition', 'while-condition'].includes(type.val)">
                <label for="condition">Condition*</label>
                <InputText id="condition" v-model.trim="condition.val"
                @blur="clearValidity('condition')" aria-describedby="condition-help" v-tooltip.left="'Input field for the condition of the workflow step.'"/>
                <small v-if="!condition.isValid && condition.required" 
                id="condition-help" class="p-error">Please input the condition of the workflow step!</small>
            </div>

            <div class="p-field" v-if="['if-condition', 'while-condition'].includes(type.val)">
                <label for="on_true">On true*</label>
                <MultiSelect  id="on_true" :options="steps" v-model="on_true.val"
                @blur="clearValidity('on_true')" aria-describedby="on_true-help" v-tooltip.left="'Selection field for playbook types.'"
                placeholder="Choose steps on_true"/>
                <small v-if="!on_true.isValid && on_true.required" 
                id="on_true-help" class="p-error">Please select the steps for the on_true hook!</small>
            </div>

            <div class="p-field" v-if="['if-condition', 'while-condition'].includes(type.val)">
                <label for="on_false">On false*</label>
                <MultiSelect  id="on_false" :options="steps" v-model="on_false.val"
                @blur="clearValidity('on_false')" aria-describedby="on_false-help" v-tooltip.left="'Selection field for playbook types.'"
                placeholder="Choose steps on_false"/>
                <small v-if="!on_false.isValid && on_false.required" 
                id="on_false-help" class="p-error">Please select the steps for the on_false hook!</small>
            </div>

            <div class="p-field" v-if="['switch-condition'].includes(type.val)">
                <label for="switchVal">Switch*</label>
                <InputText id="switchVal" v-model.trim="switchVal.val"
                @blur="clearValidity('switchVal')" aria-describedby="switchVal-help" v-tooltip.left="'Input field for the switchVal of the workflow step.'"/>
                <small v-if="!switchVal.isValid && switchVal.required" 
                id="switchVal-help" class="p-error">Please input the switch of the workflow step!</small>
            </div>

            <div class="card p-fluid" v-if="['switch-condition'].includes(type.val)">
                <div>
                    <h4>Cases*</h4>
                    <div v-for="index in casesCounter" :key="index">
                        <CasesForm @provide-case="setCases" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :nbr="nbr" :initData="getInitData(initCaseData, index)"></CasesForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="casesCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="casesCounter -= 1" v-if="casesCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <div class="card p-fluid" v-if="['single'].includes(type.val)">
                <div>
                    <h4>Commands</h4>
                    <div v-for="index in commandCounter" :key="index">
                        <CommandForm @provide-command="setCommands" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initCommandData, index)"></CommandForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="commandCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="commandCounter -= 1" v-if="commandCounter > 1">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <div class="card p-fluid">
                <div>
                    <h4>Step Variables</h4>
                    <div v-for="index in pbVarCounter" :key="index">
                        <VariablesForm @provide-variables="setPlaybookVariables" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initVariablesdata, index)"></VariablesForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="pbVarCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="pbVarCounter -= 1" v-if="pbVarCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <div class="card p-fluid">
                <div>
                    <h4>WorkflowStep Extensions</h4>
                    <div v-for="index in extensionsCounter" :key="index">
                        <ExtensionsForm @provide-extension="setExtensions" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initExtensiondata, index)"></ExtensionsForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="extensionsCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="extensionsCounter -= 1" v-if="extensionsCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
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

            <div class="card p-fluid" v-if="['single', 'playbook'].includes(type.val)">
                <div>
                    <h4>Targets</h4>
                    <div v-for="index in targetsCounter" :key="index">
                        <TargetsForm @provide-target="setTargets" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initTargetdata, index)"></TargetsForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="targetsCounter += 1" v-if="targetsCounter === 0">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="targetsCounter -= 1" v-if="targetsCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </form>
</template>

<script>
import ExtensionsForm from './ExtensionsForm.vue';
import VariablesForm from './VariablesForm.vue';
import ReferencesForm from './ReferencesForm.vue';
import CommandForm from './CommandForm.vue';
import TargetsForm from './TargetsForm.vue';
import CasesForm from './CasesForm.vue';

export default {
    emits: ["provide-workflowstep", "form-invalid"],
    props: ["edit", "trigger", "id", 'nbr', 'initData'],
    components: {
        ExtensionsForm,
        VariablesForm,
        ReferencesForm,
        CommandForm,
        TargetsForm,
        CasesForm
    },
	data() {
		return {
            subFormsEmitted: false,
            extensionsCounter: 0,
            extensionsEmitted: false,
            extensionsEmittedCounter: 0,
            pbVarCounter: 0,
            variablesEmittedCounter: 0,
            variablesEmitted: false,
            referencesEmitted: false,
            referencesEmittedCounter: 0,
            externalReferences: [],
            extRefCounter: 0,
            stepVars: [],
            extensions: [],
            target: null,
            targetsCounter: 0,
            targetsEmitted: false,
            targetsEmittedCounter: 0,
            commands: [],
            commandCounter: 0,
            commandsEmitted: false,
            commandsEmittedCounter: 0,
            casesCounter: 0,
            casesEmitted: false,
            casesEmittedCounter: 0,
            cases: [],
            workflowStepType: [ // enumerations from the CACAO standard
                'start',
                'end',
                'single',
                'playbook',
                'parallel',
                'if-condition',
                'while-condition',
                'switch-condition'
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
            delay: {
                val: null,
                isValid: true,
                required: false
            },
            timeout: {
                val: null,
                isValid: true,
                required: false
            },
            owner: {
                val: '',
                isValid: true,
                required: false
            },
            on_completion: {
                val: null,
                isValid: true,
                required: false
            },
            on_success: {
                val: null,
                isValid: true,
                required: false
            },
            on_failure: {
                val: null,
                isValid: true,
                required: false
            },
            target_ids: {
                val: '',
                isValid: true,
                required: false
            },
            in_args: {
                val: '',
                isValid: true,
                required: false
            },
            out_args: {
                val: '',
                isValid: true,
                required: false
            },
            playbook_id: {
                val: '',
                isValid: true,
                required: false
            },
            next_steps: {
                val: '',
                isValid: true,
                required: false
            },
            condition: {
                val: '',
                isValid: true,
                required: false
            },
            on_true: {
                val: '',
                isValid: true,
                required: false
            },
            on_false: {
                val: '',
                isValid: true,
                required: false
            },
            switchVal: {
                val: '',
                isValid: true,
                required: false
            },
            // initializing variables used for init the subforms in the case a playbook is edited
            initReferencesdata: null,
            initVariablesdata: null,
            initTargetdata: null,
            initExtensiondata: null,
            initCommandData: null,
            initCaseData: null
        };
	},
    watch: {
        subFormsEmitted: function(newVal) { // the form is only submitted if all subforms are in advance
            if (newVal) {
                this.submitForm();
            }
        },
        trigger: function() { // this form is already a subform of the configurator -> when it is triggered the subforms of this must be checked as well
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
    computed: {
        key() { // to get the uuidv5 of the step the full information is needed -> this computed property does that
            const ret = {};
            
            if (this.type.isValid) ret['type'] = this.type.val;
            if (this.name.isValid) ret['name'] = this.name.val;
            if (this.description.isValid) ret['description'] = this.description.val;
            if (this.delay.isValid) ret['delay'] = this.delay.val;
            if (this.timeout.isValid) ret['timeout'] = this.timeout.val;
            if (this.owner.isValid) ret['owner'] = this.owner.val;
            if (this.on_completion.isValid) ret['on_completion'] = this.on_completion.val;
            if (this.on_success.isValid) ret['on_success'] = this.on_success.val;
            if (this.on_failure.isValid) ret['on_failure'] = this.on_failure.val;
            if (this.target_ids.isValid) ret['target_ids'] = this.target_ids.val.split(',').filter(function (el) {return el !== '';});
            if (this.in_args.isValid) ret['in_args'] = this.in_args.val.split(',').filter(function (el) {return el !== '';});
            if (this.out_args.isValid) ret['out_args'] = this.out_args.val.split(',').filter(function (el) {return el !== '';});
            if (this.playbook_id.isValid) ret['playbook_id'] = this.playbook_id.val;
            if (this.next_steps.isValid) ret['next_steps'] = this.next_steps.val;
            if (this.switchVal.isValid) ret['switch'] = this.switchVal.val;
            if (this.on_true.isValid) ret['on_true'] = this.on_true.val;
            if (this.on_false.isValid) ret['on_false'] = this.on_false.val;

            if (this.externalReferences.length !== 0) ret['external_references'] = this.externalReferences;
            if (this.stepVars.length !== 0) ret['step_variables'] = this.$store.getters['help/createDictionary'](this.stepVars);
            if (this.target) ret['target'] = this.target;
            if (this.extensions.length !== 0) ret['step_extensions'] = this.$store.getters['help/createDictionary'](this.extensions);
            if (this.commands.length !== 0) ret['commands'] = this.commands;
            if (this.cases.length !== 0) ret['cases'] = this.getCases();

            return this.$store.getters['uuid/uuidv5']('workflow-step', ret);
        },
        steps() {
            const steps = this.nbr;
            const ret = [];
            for (let i = 1; i <= steps; i++) {
                ret.push(i)
            }
            return ret;
        }
    },
    methods: {
        loadData() { // when an existing playbook is edited the corresponding data is loaded into the fields in this method
            if (this.initData) {

                const stepMapping = this.initData.stepMapping;
                if (this.initData.ret.type) this.type.val = this.initData.ret.type;
                if (this.initData.ret.name) this.name.val = this.initData.ret.name;
                if (this.initData.ret.description) this.description.val = this.initData.ret.description;
                if (this.initData.ret.delay) this.delay.val = this.initData.ret.delay;
                if (this.initData.ret.timeout) this.timeout.val = this.initData.ret.timeout;
                if (this.initData.ret.owner) this.owner.val = this.initData.ret.owner;
                if (this.initData.ret.on_completion) this.on_completion.val = stepMapping[this.initData.ret.on_completion]; //id
                if (this.initData.ret.on_success) this.on_success.val = stepMapping[this.initData.ret.on_success]; //id
                if (this.initData.ret.on_failure) this.on_failure.val = stepMapping[this.initData.ret.on_failure]; //id
                if (this.initData.ret.target_ids) this.target_ids.val = this.initData.ret.target_ids.toString();
                if (this.initData.ret.in_args) this.in_args.val = this.initData.ret.in_args.toString();
                if (this.initData.ret.out_args) this.out_args.val = this.initData.ret.out_args.toString();
                if (this.initData.ret.playbook_id) this.playbook_id.val = this.initData.ret.playbook_id;
                if (this.initData.ret.next_steps) this.next_steps.val = this.mapSteps(this.initData.ret.next_steps, stepMapping); //id
                if (this.initData.ret.switch) this.switchVal.val = this.initData.ret.switch;
                if (this.initData.ret.on_true) this.on_true.val = this.mapSteps(this.initData.ret.on_true, stepMapping); //id
                if (this.initData.ret.on_false) this.on_false.val = this.mapSteps(this.initData.ret.on_false, stepMapping); //id

                if (this.initData.ret.external_references) {
                    if (this.initData.ret.external_references.length !== 0) {
                        this.initReferencesdata = this.initData.ret.external_references;
                        this.extRefCounter = this.initReferencesdata.length
                    }
                }
                if (this.initData.ret.step_variables) {
                    this.initVariablesdata = this.$store.getters['help/reverseDictionary'](this.initData.ret.step_variables);
                    this.pbVarCounter = this.initVariablesdata.length;
                }
                if (this.initData.ret.step_extensions) {
                    this.initExtensiondata = this.$store.getters['help/reverseDictionary'](this.initData.ret.step_extensions);
                    this.extensionsCounter = this.initExtensiondata.length
                }
                if (this.initData.ret.target) {
                    this.initTargetdata = [{ret: this.initData.ret.target}];
                    this.targetsCounter = this.initTargetdata.length
                }
                if (this.initData.ret.commands.length !== 0) {
                    this.initCommandData = this.initData.ret.commands;
                    this.commandCounter = this.initCommandData.length
                }
                if (this.initData.ret.cases) {
                    if (this.initData.ret.cases.length !== 0) {
                        const arr = this.initData.ret.cases;
                        for (const key in arr) {
                            arr[key] = this.mapSteps(arr[key], stepMapping)
                        }
                        this.initCaseData = this.$store.getters['help/reverseDictionary'](arr);
                        this.casesCounter = this.initCaseData.length;
                    }
                }
                
            }
        },
        mapSteps(arr, dict) { // creates a map for the step ids to the integer number (for better understanding of the user)
            const ret = [];
            for (const i of arr) {
                ret.push(dict[i]);
            }
            return ret;
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
        setExtensions(event) { // saves the data from the extensionform
            this.extensions.push(event);
            
            this.extensionsEmittedCounter += 1;
            if (this.extensionsEmittedCounter === this.extensionsCounter) {
                this.extensionsEmitted = true;
            }
            this.checkSubEmits();
        },
        setPlaybookVariables(event) { // saves the data from the variablesform
            this.stepVars.push(event);
            
            this.variablesEmittedCounter += 1;
            if (this.variablesEmittedCounter === this.pbVarCounter) {
                this.variablesEmitted = true;
            }
            this.checkSubEmits();
        },
        setExternalReferences(event) { // saves the data from the referencesform
            this.externalReferences.push(event.ret);

            this.referencesEmittedCounter += 1;
            if (this.referencesEmittedCounter === this.extRefCounter) {
                this.referencesEmitted = true;
            }
            this.checkSubEmits();
        },
        setCommands(event) { // saves the data from the comandsform
            this.commands.push(event.ret);

            this.commandsEmittedCounter += 1;
            if (this.commandsEmittedCounter === this.commandCounter) {
                this.commandsEmitted = true;
            }
            this.checkSubEmits();
        },
        setTargets(event) { // saves the data from the targetsform
            const data = event.ret;
            delete data.key
            this.target = data;

            this.targetsEmittedCounter += 1;
            if (this.targetsEmittedCounter === this.targetsCounter) {
                this.targetsEmitted = true;
            }
            this.checkSubEmits();
        },
        setCases(event) { // saves the data from the casesform
            this.cases.push(event);

            this.casesEmittedCounter += 1;
            if (this.casesEmittedCounter === this.casesCounter) {
                this.casesEmitted = true;
            }
            this.checkSubEmits();            
        },
        checkSubEmits() { // method that checks if all the subforms have emitted the required data
            if (this.extensionsCounter === 0) {
                this.extensionsEmitted = true;
            }

            if (this.extRefCounter === 0) {
                this.referencesEmitted = true;
            }

            if (this.pbVarCounter === 0) {
                this.variablesEmitted = true;
            }

            if (this.targetsCounter === 0) {
                this.targetsEmitted = true;
            }

            if (this.targetsCounter === 0) {
                this.targetsEmitted = true;
            }

            if (this.commandCounter === 0) {
                this.commandsEmitted = true;
            }

            if (this.casesCounter === 0) {
                this.casesEmitted = true;
            }
            
            if (this.extensionsEmitted && this.referencesEmitted && this.variablesEmitted &&  this.targetsEmitted && this.commandsEmitted && this.casesEmitted) {
                this.subFormsEmitted = true;
            }
        },
        resetForm() { // method that sets the form empty 
            this.name.val = '';
            this.description.val = '';
            this.delay.val = null;
            this.timeout.val = null;
            this.owner.val = '';
            this.on_completion.val = null;
            this.on_success.val = null;
            this.on_failure.val = null;
            this.target_ids.val = '';
            this.in_args.val = '';
            this.out_args.val = '';
            this.playbook_id.val = '';
            this.next_steps.val = '';
            this.switchVal.val = '';
            this.on_true.val = '';
            this.on_false.val = '';
        },
        validateInputs() { // validation of the input data
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
            if(this.delay.val == null) {
                this.delay.isValid = false;
            }
            if(this.timeout.val == null) {
                this.timeout.isValid = false;
            }
            if(this.owner.val == '') {
                this.owner.isValid = false;
            }
            if(this.on_completion.val == null) {
                this.on_completion.isValid = false;
            }
            if(this.on_success.val == null) {
                this.on_success.isValid = false;
            }
            if(this.on_failure.val == null) {
                this.on_failure.isValid = false;
            }
            if(this.target_ids.val == '') {
                this.target_ids.isValid = false;
            }
            if(this.in_args.val == '') {
                this.in_args.isValid = false;
            }
            if(this.out_args.val == '') {
                this.out_args.isValid = false;
            }
            if(this.next_steps.val == '') {
                this.next_steps.isValid = false;
            }
            if(this.switchVal.val == '') {
                this.switchVal.isValid = false;
            }
            if(this.playbook_id.val == '') {
                this.playbook_id.isValid = false;
            }
            if(this.on_true.val == '') {
                this.on_true.isValid = false;
            }
            if(this.on_false.val == '') {
                this.on_false.isValid = false;
            }
            
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        getCases() {
            const cases = this.cases;
            const ret = {};
            const idxs = [];
            for (const cas of cases) {
                if (!idxs.includes(cas.index) && cas.ret.key) {
                    idxs.push(cas.index);
                    ret[cas.ret.key] = cas.ret.steps
                }
            }
            return ret;
        },
        emitInvalidity() {
            this.$emit("form-invalid");
        },
        submitForm(){ // submit the form
            this.subFormsEmitted = false; // all valuas are set to their initial state
            this.referencesEmitted = false;
            this.referencesEmittedCounter = 0;
            this.variablesEmitted = false;
            this.variablesEmittedCounter = 0;
            this.extensionsEmitted = false;
            this.extensionsEmittedCounter = 0;
            this.targetsEmitted = false;
            this.targetsEmittedCounter = 0;
            this.casesEmitted = false;
            this.casesEmittedCounter = 0;

            if(this.validateInputs()) {
                const ret = {}; // the return object is built from the different components
                if (this.type.isValid) ret['type'] = this.type.val;
                if (this.name.isValid) ret['name'] = this.name.val;
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.delay.isValid) ret['delay'] = this.delay.val;
                if (this.timeout.isValid) ret['timeout'] = this.timeout.val;
                if (this.owner.isValid) ret['owner'] = this.owner.val;
                if (this.on_completion.isValid) ret['on_completion'] = this.on_completion.val;
                if (this.on_success.isValid) ret['on_success'] = this.on_success.val;
                if (this.on_failure.isValid) ret['on_failure'] = this.on_failure.val;
                if (this.target_ids.isValid) ret['target_ids'] = this.target_ids.val.split(',').filter(function (el) {return el !== '';});
                if (this.in_args.isValid) ret['in_args'] = this.in_args.val.split(',').filter(function (el) {return el !== '';});
                if (this.out_args.isValid) ret['out_args'] = this.out_args.val.split(',').filter(function (el) {return el !== '';});
                if (this.playbook_id.isValid) ret['playbook_id'] = this.playbook_id.val;
                if (this.next_steps.isValid) ret['next_steps'] = this.next_steps.val;
                if (this.switchVal.isValid) ret['switch'] = this.switchVal.val;
                if (this.on_true.isValid) ret['on_true'] = this.on_true.val;
                if (this.on_false.isValid) ret['on_false'] = this.on_false.val;

                if (this.externalReferences.length !== 0) ret['external_references'] = this.externalReferences;
                if (this.stepVars.length !== 0) ret['step_variables'] = this.$store.getters['help/createDictionary'](this.stepVars);
                if (this.target) ret['target'] = this.target;
                if (this.extensions.length !== 0) ret['step_extensions'] = this.$store.getters['help/createDictionary'](this.extensions);
                if (this.commands.length !== 0) ret['commands'] = this.commands;
                if (this.cases.length !== 0) ret['cases'] = this.getCases();
                ret['key'] = this.key;

                this.externalReferences = []; // variables content is deleted to avoid dulicate errors
                this.stepVars = [];
                this.target = null;
                this.extensions = [];
                this.commands = [];
                this.cases = [];

                this.$emit("provide-workflowstep", { // event is emitted with the return object
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