// component for the detailed presentation of a specific pattern
<template>
<!-- actions that the user can take to interact with the document -->
    <div class="card">
        <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">     
            <span class="p-input-icon-right">
                <Button @click="$router.push({ name: 'patternlist'});">Back</Button>
            </span>

            <span class="p-input-icon-right" v-if="editable && pattern">
                <Button class="p-button-warning" @click="editPattern">Edit Pattern</Button>
            </span>
        </div>
    </div>

    <div class="card" v-if="infoVisible">
        <h1>Pattern</h1>

        <p>ID: <strong>{{pattern._id}}</strong></p>
        <p>Name: <strong>{{pattern.name}}</strong></p>
        <p>Description: <strong>{{pattern.description}}</strong></p>

        <div v-if="pattern.matching_terms.length !== 0" class="card p-fluid major-card">
            <h3>Matching Terms:</h3>
            <div v-for="(item, index) of pattern.matching_terms" :key="index">
                <p>{{index + ' : ' + item.toString()}}</p>
            </div>
        </div>

        <!-- the workflow step is presented using the dedicated component implemented for visualizing the CACAO standard -->
        <div class="info" v-if="pattern.workflow_step">
            <PBWorkflow :workflow="{'PredefinedWorkflowStep': pattern.workflow_step}"></PBWorkflow>
        </div>
    </div>
</template>

<script>
import PBWorkflow from '../playbook/PBWorkflow.vue';

export default {
    props: ['id'],
    components: {
        PBWorkflow
    },
	data() {
		return {
            infoVisible: false,
            editable: true,
            pattern: null
		}
	},
    methods: {
        async fetchData() {
            try {

                await this.$store.dispatch('pattern/get', {_id: this.id});
                this.pattern = this.$store.getters['pattern/getById'](this.id);
                
                this.infoVisible = true
            } catch (error) {
                console.log(error);
            }
        },
        editPattern() { // when the pattern should be altered the dedicated component is called
            this.$router.push(
                {
                    name: 'editPattern',
                    params: { id: this.id }
                }
            );
        }
    },
    created() {
        this.fetchData();
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
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