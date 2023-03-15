// component for visualizing the content of a specific playbook
// because of the scale of the CACAO standard the functionality is split into different components to reduce the complexity of each one
<template>

    <div class="info">
        <PBMetadata :playbook="playbook"></PBMetadata>
    </div>

    <div class="info" v-if="playbook.workflow">
        <PBWorkflow :workflow="playbook.workflow"></PBWorkflow>
    </div>
    
    <div class="info" v-if="playbook.external_references">
        <PBExternalReferences :references="playbook.external_references"></PBExternalReferences>
    </div>

    <div class="info" v-if="playbook.features">
        <PBFeatures :features="playbook.features"></PBFeatures>
    </div>

    <div class="info" v-if="playbook.playbook_variables">
        <PBVariables :variables="playbook.playbook_variables"></PBVariables>
    </div>

    <div class="info" v-if="playbook.targets">
        <PBTargets :targets="playbook.targets"></PBTargets>
    </div>

    <div class="info" v-if="playbook.extension_definitions">
        <PBExtensions :extensions="playbook.extension_definitions"></PBExtensions>
    </div>

    <div class="info" v-if="playbook.data_marking_definitions">
        <PBMarkings :markings="playbook.data_marking_definitions"></PBMarkings>
    </div>

    <div v-if="playbook.signatures.length !== 0">
        <PBSignatures :signatures="playbook.signatures"></PBSignatures>
    </div>
    
</template>

<script>
import PBMetadata from './PBMetadata.vue';
import PBExternalReferences from './PBExternalReferences.vue';
import PBFeatures from './PBFeatures.vue';
import PBVariables from './PBVariables.vue';
import PBTargets from './PBTargets.vue';
import PBExtensions from './PBExtensions.vue';
import PBMarkings from './PBMarkings.vue';
import PBSignatures from './PBSignatures.vue';
import PBWorkflow from './PBWorkflow.vue';

export default {
    props: ['playbook'],
    components: {
        PBMetadata,
        PBExternalReferences,
        PBFeatures,
        PBVariables,
        PBTargets,
        PBExtensions,
        PBMarkings,
        PBSignatures,
        PBWorkflow
    }
}
</script>

<style>
    .info {
        padding-bottom: 1rem;
    }
</style>