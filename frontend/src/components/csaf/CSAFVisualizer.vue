// this is the central component for visualizing the data of the CSAF compliant document
// because of the different properties and their submodels the visualizer is split up into the different properties to break down the complexity of each component
<template>

    <div class="info">
        <CSAFMetadata :csaf="csaf.document"></CSAFMetadata>
    </div>

    <div class="info" v-if="csaf.document.distribution">
        <CSAFDistribution :distribution="csaf.document.distribution"></CSAFDistribution>
    </div>

    <div class="info" v-if="csaf.document.publisher">
        <CSAFPublisher :publisher="csaf.document.publisher"></CSAFPublisher>
    </div>

    <div class="info" v-if="csaf.document.tracking">
        <CSAFTracking :tracking="csaf.document.tracking"></CSAFTracking>
    </div>

    <div class="info" v-if="csaf.document.notes.length !== 0">
        <CSAFNotes :notes="csaf.document.notes"></CSAFNotes>
    </div>

    <div class="info" v-if="csaf.document.references.length !== 0">
        <CSAFReferences :references="csaf.document.references"></CSAFReferences>
    </div>

    <div class="info" v-if="csaf.vulnerabilities.length !== 0">
        <CSAFVulnerabilities :vulnerabilities="csaf.vulnerabilities" :productTree="csaf.product_tree"></CSAFVulnerabilities>
    </div>

    <div class="info" v-if="csaf.product_tree">
        <CSAFProducttree :producttree="csaf.product_tree"></CSAFProducttree>
    </div>

    <div class="info" v-if="csaf.document.acknowledgements.length !== 0">
        <CSAFAcknowledgements :acknowledgements="csaf.document.acknowledgements"></CSAFAcknowledgements>
    </div>

    <div v-if="csaf.document.aggregate_severity.length !== 0">
        <CSAFAggregateseverity :aggregateseveritiy="csaf.document.aggregate_severity"></CSAFAggregateseverity>
    </div>
    
</template>

<script>
import CSAFMetadata from './CSAFMetadata.vue';
import CSAFDistribution from './CSAFDistribution.vue';
import CSAFPublisher from './CSAFPublisher.vue';
import CSAFTracking from './CSAFTracking.vue';
import CSAFNotes from './CSAFNotes.vue';
import CSAFReferences from './CSAFReferences.vue';
import CSAFVulnerabilities from './CSAFVulnerabilities.vue';
import CSAFAcknowledgements from './CSAFAcknowledgements.vue';
import CSAFAggregateseverity from './CSAFAggregateseverity.vue';
import CSAFProducttree from './CSAFProducttree.vue';

export default {
    props: ['csaf'],
    components: {
        CSAFMetadata,
        CSAFDistribution,
        CSAFPublisher,
        CSAFTracking,
        CSAFNotes,
        CSAFReferences,
        CSAFVulnerabilities,
        CSAFAcknowledgements,
        CSAFAggregateseverity,
        CSAFProducttree
    }
}
</script>

<style>
    .info {
        padding-bottom: 1rem;
    }
</style>