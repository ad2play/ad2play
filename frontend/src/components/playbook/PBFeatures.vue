// component for presenting the features of the playbook
<template>
    <Panel header="Features" :toggleable="true" :collapsed="true">
        <p v-if="features.parallel_processing">Parallel Processing: <strong>{{features.parallel_processing}}</strong></p>
        <p v-if="features.if_logic">If logic: <strong>{{features.if_logic}}</strong></p>
        <p v-if="features.while_logic">While logic: <strong>{{features.while_logic}}</strong></p>
        <p v-if="features.switch_logic">Switch logic: <strong>{{features.switch_logic}}</strong></p>
        <p v-if="features.temporal_logic">Temporal logic: <strong>{{features.temporal_logic}}</strong></p>
        <p v-if="features.data_markings">Data markings: <strong>{{features.data_markings}}</strong></p>
        <p v-if="features.extensions">Extensions: <strong>{{features.extensions}}</strong></p>
    </Panel>
</template>

<script>
export default {
    props: ['features']
}
</script>