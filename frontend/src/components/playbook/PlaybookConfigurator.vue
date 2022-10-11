// configurator for creating CACAO compliant playbooks
// because of the complexity of the standard the configurator is based on a form tree 
// this means many forms (that each can have subforms etc) built the whole construct of the configurator
<template>
    <div class="card p-fluid">
        <h1>Playbook Configurator</h1>
    </div>

    <div class="card p-fluid">
        <div>
            <h4>Meta Data</h4>
            <MetaDataForm @provide-metadata="setMetaData" @form-invalid="toastInvalid" :trigger="trigger" :initData="initMetadata"></MetaDataForm>
        </div>
    </div>

    <div class="card p-fluid">
        <div>
            <h4>Workflow</h4>
            <div v-for="index in workflowCounter" :key="index">
                <WorkflowStepForm @provide-workflowstep="setWorkflow" @form-invalid="toastInvalid" :trigger="trigger" :id="index" :nbr="workflowCounter" :initData="getInitData(initWorkflowdata, index)"></WorkflowStepForm>
            </div>
            <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                <Button class="p-button-success p-mr-2 p-mb-1" @click="workflowCounter += 1">Add</Button>
                <Button class="p-button-warning p-mr-2 p-mb-1" @click="workflowCounter -= 1" v-if="workflowCounter > 0">Delete Last</Button>
            </div>
            
        </div>
    </div>

    <div class="card p-fluid">
        <div>
            <h4>External References</h4>
            <div v-for="index in extRefCounter" :key="index">
                <ReferencesForm @provide-references="setExternalReferences" @form-invalid="toastInvalid" :trigger="trigger" :id="index" :initData="getInitData(initReferencesdata, index)"></ReferencesForm>
            </div>
            <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                <Button class="p-button-success p-mr-2 p-mb-1" @click="extRefCounter += 1">Add</Button>
                <Button class="p-button-warning p-mr-2 p-mb-1" @click="extRefCounter -= 1" v-if="extRefCounter > 0">Delete Last</Button>
            </div>
            
        </div>
    </div>

    <!-- Features generated automatically -->

    <div class="card p-fluid">
        <div>
            <h4>Playbook Variables</h4>
            <div v-for="index in pbVarCounter" :key="index">
                <VariablesForm @provide-variables="setPlaybookVariables" @form-invalid="toastInvalid" :trigger="trigger" :id="index" :initData="getInitData(initVariablesdata, index)"></VariablesForm>
            </div>
            <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                <Button class="p-button-success p-mr-2 p-mb-1" @click="pbVarCounter += 1">Add</Button>
                <Button class="p-button-warning p-mr-2 p-mb-1" @click="pbVarCounter -= 1" v-if="pbVarCounter > 0">Delete Last</Button>
            </div>
            
        </div>
    </div>

    <div class="card p-fluid">
        <div>
            <h4>Targets</h4>
            <div v-for="index in targetsCounter" :key="index">
                <TargetsForm @provide-target="setTargets" @form-invalid="toastInvalid" :trigger="trigger" :id="index" :initData="getInitData(initTargetdata, index)"></TargetsForm>
            </div>
            <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                <Button class="p-button-success p-mr-2 p-mb-1" @click="targetsCounter += 1">Add</Button>
                <Button class="p-button-warning p-mr-2 p-mb-1" @click="targetsCounter -= 1" v-if="targetsCounter > 0">Delete Last</Button>
            </div>
            
        </div>
    </div>

    <div class="card p-fluid">
        <div>
            <h4>Playbook Extensions</h4>
            <div v-for="index in extensionsCounter" :key="index">
                <ExtensionsForm @provide-extension="setExtensions" @form-invalid="toastInvalid" :trigger="trigger" :id="index" :initData="getInitData(initExtensiondata, index)"></ExtensionsForm>
            </div>
            <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                <Button class="p-button-success p-mr-2 p-mb-1" @click="extensionsCounter += 1">Add</Button>
                <Button class="p-button-warning p-mr-2 p-mb-1" @click="extensionsCounter -= 1" v-if="extensionsCounter > 0">Delete Last</Button>
            </div>
            
        </div>
    </div>

    <div class="card p-fluid">
        <div>
            <h4>Data Marking Definitions</h4>
            <div v-for="index in dataMarkingsCounter" :key="index">
                <DataMarkingsForm @provide-marking="setMarkings" @form-invalid="toastInvalid" :trigger="trigger" :id="index" :initData="getInitData(initDatamarkingdata, index)"></DataMarkingsForm>
            </div>
            <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                <Button class="p-button-success p-mr-2 p-mb-1" @click="dataMarkingsCounter += 1">Add</Button>
                <Button class="p-button-warning p-mr-2 p-mb-1" @click="dataMarkingsCounter -= 1" v-if="dataMarkingsCounter > 0">Delete Last</Button>
            </div>
            
        </div>
    </div>

    <div class="card p-fluid">
        <div>
            <h4>Signatures</h4>
            <div v-for="index in signaturesCounter" :key="index">
                <SignatureForm @provide-signature="setSignatures" @form-invalid="toastInvalid" :trigger="trigger" :id="index" :initData="getInitData(initSignaturedata, index)"></SignatureForm>
            </div>
            <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                <Button class="p-button-success p-mr-2 p-mb-1" @click="signaturesCounter += 1">Add</Button>
                <Button class="p-button-warning p-mr-2 p-mb-1" @click="signaturesCounter -= 1" v-if="signaturesCounter > 0">Delete Last</Button>
            </div>
            
        </div>
    </div>

    <div class="card p-fluid">
        <div class="p-field">
            <Button label="Submit" type="submit" v-tooltip.left="'Submit Form.'" @click="triggerSubForms"></Button>
        </div>
    </div>
</template>

<script>
import MetaDataForm from './SubForms/MetaDataForm.vue';
import ReferencesForm from './SubForms/ReferencesForm.vue';
import VariablesForm from './SubForms/VariablesForm.vue';
import TargetsForm from './SubForms/TargetsForm.vue';
import ExtensionsForm from './SubForms/ExtensionsForm.vue';
import DataMarkingsForm from './SubForms/DataMarkingsForm.vue';
import SignatureForm from './SubForms/SignatureForm.vue';
import WorkflowStepForm from './SubForms/WorkflowStepForm.vue';

export default {
    emits: ["playbook-created"],
    props: ["submitLabel", "editId"],
    components: {
        MetaDataForm,
        ReferencesForm,
        VariablesForm,
        TargetsForm,
        ExtensionsForm,
        DataMarkingsForm,
        SignatureForm,
        WorkflowStepForm
    },
	data() {
		return {
            metaData: null,
            externalReferences: [],
            extRefCounter: 0,
            playbookVariables: [],
            targets: [],
            targetsCounter: 0,
            pbVarCounter: 0,
            extensions: [],
            extensionsCounter: 0,
            extensionsEmitted: false,
            extensionsEmittedCounter: 0,
            trigger: 0,
            metaDataEmitted: false,
            referencesEmitted: false,
            referencesEmittedCounter: 0,
            variablesEmitted: false,
            variablesEmittedCounter: 0,
            targetsEmitted: false,
            targetsEmittedCounter: 0,
            dataMarkings: [],
            dataMarkingsCounter: 0,
            dataMarkingsEmitted: false,
            dataMarkingsEmittedCounter: 0,
            signatures: [],
            signaturesCounter: 0,
            signaturesEmitted: false,
            signaturesEmittedCounter: 0,
            workflowSteps: [],
            workflowCounter: 0,
            workflowEmitted: false,
            workflowEmittedCounter : 0,
            subFormsEmitted: false,
            firstStep: '',
            // init data for the case that the configurator is called to edit an existing playbook
            initMetadata: null, 
            initWorkflowdata: null,
            initReferencesdata: null,
            initVariablesdata: null,
            initTargetdata: null,
            initExtensiondata: null,
            initDatamarkingdata: null,
            initSignaturedata: null
        };
	},
    watch: {
        subFormsEmitted: function(newVal) { // the overall form can only be submitted if every subform (including possible subsubforms) are submitted in advance
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
        toastInvalid() { // for the case that a subform was not valid the error is sent to the parent form and an error-toast is shown to the user
            this.$toast.add({severity:'error', summary: 'Form invalid! Playse fill the mandatory fields with the proper data', life: 5000});
        },
        async loadData() { // method for loading the data into the fields when editing an existing playbook
            if (this.editId) {
                await this.$store.dispatch('playbook/get', {_id: this.editId});
                var playbook = this.$store.getters['playbook/getById'](this.editId);
                if (playbook) {
                    this.initMetadata = playbook;
                    // console.log(playbook)
                    if (playbook.external_references.length !== 0) {
                        this.initReferencesdata = playbook.external_references;
                        this.extRefCounter = this.initReferencesdata.length
                    }
                    if (playbook.data_marking_definitions) {
                        this.initDatamarkingdata = this.$store.getters['help/reverseDictionary'](playbook.data_marking_definitions); // fit the dictionary data to the input data the component needs
                        this.dataMarkingsCounter = this.initDatamarkingdata.length
                    }
                    if (playbook.playbook_variables) {
                        this.initVariablesdata = this.$store.getters['help/reverseDictionary'](playbook.playbook_variables); // fit the dictionary data to the input data the component needs
                        this.pbVarCounter = this.initVariablesdata.length
                    }
                    if (playbook.extension_definitions) {
                        this.initExtensiondata = this.$store.getters['help/reverseDictionary'](playbook.extension_definitions); // fit the dictionary data to the input data the component needs
                        this.extensionsCounter = this.initExtensiondata.length
                    }
                    if (playbook.signatures.length !== 0) {
                        this.initSignaturedata = playbook.signatures;
                        this.signaturesCounter = this.initSignaturedata.length
                    }
                    if (playbook.workflow) {
                        this.initWorkflowdata = this.$store.getters['help/reverseDictionary'](playbook.workflow); // fit the dictionary data to the input data the component needs
                        this.mapStepIdsToData(playbook.workflow); // step ids are changed from uuidv5 to integer -> better understanding for the user
                        this.workflowCounter = this.initWorkflowdata.length
                    }                    
                    if (playbook.targets) {
                        this.initTargetdata = this.$store.getters['help/reverseDictionary'](playbook.targets); // fit the dictionary data to the input data the component needs
                        this.targetsCounter = this.initTargetdata.length
                    }
                }    
            }
        },
        mapStepIdsToData(steps) { // saves the step mapping ids - integer to provide context for the other components
            let count = 1;
            const ret = {};
            for (const key in steps) {
                ret[key] = count;
                count++;
            }

            for (const item of this.initWorkflowdata) {
                item['stepMapping'] = ret;
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
        triggerSubForms() { 
            this.trigger += 1;        
        },
        setMetaData(event) { // method that saves the data emitted from the metadataform
            this.metaData = event;

            this.metaDataEmitted = true;
            this.checkSubEmits();
        },
        setExternalReferences(event) { // method that saves the data emitted from the ecternalreferencesform
            this.externalReferences.push(event.ret);

            this.referencesEmittedCounter += 1;
            if (this.referencesEmittedCounter === this.extRefCounter) {
                this.referencesEmitted = true;
            }
            this.checkSubEmits();
        },
        setPlaybookVariables(event) { // method that saves the data emitted from the variablesform
            this.playbookVariables.push(event);

            this.variablesEmittedCounter += 1;
            if (this.variablesEmittedCounter === this.pbVarCounter) {
                this.variablesEmitted = true;
            }
            this.checkSubEmits();
        },
        setTargets(event) { // method that saves the data emitted from the targetsform
            this.targets.push(event);

            this.targetsEmittedCounter += 1;
            if (this.targetsEmittedCounter === this.targetsCounter) {
                this.targetsEmitted = true;
            }
            this.checkSubEmits();
        },
        setExtensions(event) { // method that saves the data emitted from the extensionsform
            this.extensions.push(event);

            this.extensionsEmittedCounter += 1;
            if (this.extensionsEmittedCounter === this.extensionsCounter) {
                this.extensionsEmitted = true;
            }
            this.checkSubEmits();
        },
        setMarkings(event) { // method that saves the data emitted from the markingsform
            this.dataMarkings.push(event);

            this.dataMarkingsEmittedCounter += 1;
            if (this.dataMarkingsEmittedCounter === this.dataMarkingsCounter) {
                this.dataMarkingsEmitted = true;
            }
            this.checkSubEmits();
        },
        setSignatures(event) { // method that saves the data emitted from the signaturesform
            this.signatures.push(event.ret);

            this.signaturesEmittedCounter += 1;
            if (this.signaturesEmittedCounter === this.signaturesCounter) {
                this.signaturesEmitted = true;
            }
            this.checkSubEmits();
        },
        setWorkflow(event) { // method that saves the data emitted from the workflowform
            this.workflowSteps.push(event);

            this.workflowEmittedCounter += 1;
            if (this.workflowEmittedCounter === this.workflowCounter) {
                this.workflowEmitted = true;
            }
            this.checkSubEmits();
        },
        submitForm() { // method to submit the form
            console.log('EMIT: Playbook');
            this.metaDataEmitted = false; //all these values must be set back to their initial state -> otherwise the form can't be submitted correctly (if error and new submit) 
            this.referencesEmitted = false;
            this.referencesEmittedCounter = 0;
            this.variablesEmitted = false;
            this.variablesEmittedCounter = 0;
            this.targetsEmitted = false;
            this.targetsEmittedCounter = 0;
            this.dataMarkingsEmittedCounter = 0;
            this.dataMarkingsEmitted = false;
            this.signaturesEmittedCounter = 0;
            this.signaturesEmitted = false;
            this.workflowEmittedCounter = 0;
            this.workflowEmitted = false;
            this.subFormsEmitted = false;


            const ret = this.metaData; // all components are added into one object
            if (this.externalReferences) if (this.externalReferences.length !== 0) ret['external_references'] = this.externalReferences;
            if (this.playbookVariables) if (this.playbookVariables.length !== 0) ret['playbook_variables'] = this.$store.getters['help/createDictionary'](this.playbookVariables);
            if (this.targets) if (this.targets.length !== 0) ret['targets'] = this.$store.getters['help/createDictionary'](this.targets);
            if (this.extensions)  if (this.extensions.length !== 0) ret['extension_definitions'] = this.$store.getters['help/createDictionary'](this.extensions);            
            if (this.dataMarkings) if (this.dataMarkings.length !== 0) ret['data_marking_definitions'] = this.$store.getters['help/createDictionary'](this.dataMarkings);
            if (this.signatures) if (this.signatures.length !== 0) ret['signatures'] = this.signatures;
            if (this.workflowSteps) if (this.workflowSteps.length !== 0) ret['workflow'] = this.transformWorkflow();
            if (this.firstStep !== '') ret['workflow_start'] = this.firstStep;

            const playbook = this.enrichPlaybook(ret); // additional properties are added to fill the playbook
            this.$emit("playbook-created", playbook); 

            this.externalReferences = []; // these values are also set to their initial state to avoid errors with duplicates
            this.playbookVariables = [];
            this.targets = [];
            this.extensions = [];
            this.signatures = [];
            this.workflowSteps = [];
            this.firstStep = '';
        },
        checkSubEmits() { // method that checks if all subforms have emitted the right amount of information
            if (this.extRefCounter === 0) {
                this.referencesEmitted = true;
            }

            if (this.pbVarCounter === 0) {
                this.variablesEmitted = true;
            }

            if (this.targetsCounter === 0) {
                this.targetsEmitted = true;
            }

            if (this.extensionsCounter === 0) {
                this.extensionsEmitted = true;
            }

            if (this.dataMarkingsCounter === 0) {
                this.dataMarkingsEmitted = true;
            }

            if (this.signaturesCounter === 0) {
                this.signaturesEmitted = true;
            }

            if (this.workflowCounter === 0) {
                this.workflowEmitted = true;
            }

            if (this.metaDataEmitted &&this.referencesEmitted && this.variablesEmitted && this.targetsEmitted && this.extensionsEmitted && this.dataMarkingsEmitted && this.signaturesEmitted && this.workflowEmitted) {
                this.subFormsEmitted = true;
            }
        },
        transformWorkflow() { //method that transforms the single steps into the standard compliant workflow for the CACAO playbooks
            let workFlow = this.workflowSteps;
            workFlow = workFlow.sort((a, b) => a.index - b.index);

            const ret = {};
            const idxs = [];
            const dict = {};
            for (const step of workFlow) {
                if (!idxs.includes(step.index) && step.ret.key) {
                    idxs.push(step.index);
                    dict[step.index] = step.ret.key
                }
            }

            if(idxs.includes(1)) {
                this.firstStep = dict[1];
            }

            for (const st of workFlow) {
                const key = st.ret.key;
                const step = st.ret;
                delete step.key;

                if (step.on_completion) step.on_completion = dict[step.on_completion];
                if (step.on_success) step.on_success = dict[step.on_success];
                if (step.on_failure) step.on_failure = dict[step.on_failure];

                let tmp = [];
                if (step.next_steps) {
                    for (const item of step.next_steps) {
                        tmp.push(dict[item]);
                    }
                    step.next_steps = tmp;
                }
                tmp = [];

                if (step.on_true) {
                    for (const item of step.on_true) {
                        tmp.push(dict[item]);
                    }
                    step.on_true = tmp;
                }
                tmp = [];

                if (step.on_false) {
                    for (const item of step.on_false) {
                        tmp.push(dict[item]);
                    }
                    step.on_false = tmp;
                }
                tmp = [];

                if (step.cases) {
                    for (const prop in step.cases) {
                        for (const i of step.cases[prop]) {
                            tmp.push(dict[i]);
                        }
                        step.cases[prop] = tmp;
                        tmp = [];
                    }
                }

                ret[key] = step;
            }
            return ret;
        },
        enrichPlaybook(data) { // method that automatically generates the features properties based on the structure of the playbook
            const ret = data;

            const features = {
                parallel_processing: false,
                if_logic: false,
                while_logic: false,
                switch_logic: false,
                temporal_logic: false,
                data_markings: false,
                extensions: false
            }

            if (ret.extensions) {
                features.extensions = true;
            }
            if (ret.data_marking_definitions) {
                features.data_markings = true;
            }
            if (ret.workflow) {
                for (const prop in ret.workflow) {
                    if (ret.workflow[prop].type === 'parallel') {
                        features.parallel_processing = true;
                    } else if (ret.workflow[prop].type === 'if-condition') {
                        features.if_logic = true;
                    } else if (ret.workflow[prop].type === 'while-condition') {
                        features.while_logic = true;
                    } else if (ret.workflow[prop].type === 'switch-condition') {
                        features.switch_logic = true;
                    }

                    if (ret.workflow[prop].delay || ret.workflow[prop].timeout) {
                        features.temporal_logic = true;
                    }
                }
            }

            ret['features'] = features;
            const fullplaybook = ret;
            fullplaybook['id'] = this.$store.getters['uuid/uuidv5']('playbook', ret);
            return fullplaybook;
        }
    }	
}
</script>