// component for visualizing the tracking property of the csaf document
<template>
    <Panel header="Tracking" :toggleable="true" :collapsed="true">
        <p v-if="tracking.id">ID: <strong>{{tracking.id}}</strong></p>
        <p v-if="tracking.aliases.length !== 0">Aliases: <strong>{{tracking.aliases}}</strong></p>
        <p v-if="tracking.current_release_date">Current release date: <strong>{{(tracking.current_release_date != null) ? new Date(tracking.current_release_date).toLocaleDateString("locale") : ''}}</strong></p>
        <p v-if="tracking.initial_release_date">Initial release date: <strong>{{(tracking.initial_release_date != null) ? new Date(tracking.initial_release_date).toLocaleDateString("locale") : ''}}</strong></p>
        <p v-if="tracking.status">Status: <strong>{{tracking.status}}</strong></p>
        <p v-if="tracking.version">Version: <strong>{{tracking.version}}</strong></p>

        <Panel class="info" header="Generator" :toggleable="true" v-if="tracking.generator" :collapsed="true">
            <p v-if="tracking.generator.date">Date: <strong>{{(tracking.generator.date != null) ? new Date(tracking.generator.date).toLocaleDateString("locale") : ''}}</strong></p>
            <div v-if="tracking.generator.engine">
                <p v-if="tracking.generator.engine.name">Name: <strong>{{tracking.generator.engine.name}}</strong></p>
                <p v-if="tracking.generator.engine.version">Version: <strong>{{tracking.generator.engine.version}}</strong></p>
            </div>
        </Panel>

        <Panel class="info" header="Revision History" :toggleable="true" v-if="tracking.revision_history" :collapsed="true">
            <Accordion  :activeIndex="0">
                <AccordionTab :key="rev.summary" v-for="rev of tracking.revision_history" :header="rev.summary">
                    <p v-if="rev.date">Date: <strong>{{(rev.date != null) ? new Date(rev.date).toLocaleDateString("locale") : ''}}</strong></p>
                    <p v-if="rev.summary">Summary: <strong>{{rev.summary}}</strong></p>
                    <p v-if="rev.number">Number: <strong>{{rev.number}}</strong></p>
                    <p v-if="rev.legacy_version">Legacy version: <strong>{{rev.legacy_version}}</strong></p>
                </AccordionTab>
            </Accordion>
        </Panel>

    </Panel>
</template>

<script>
export default {
    props: ['tracking']
}
</script>

<style>
    .info {
        padding-bottom: 1rem;
    }
</style>