// component for visualizing the acknowledgement property of the csaf document
<template>
    <Panel header="Acknowledgements" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="acknowledgements.indexOf(ack)" v-for="ack of acknowledgements" :header="acknowledgements.indexOf(ack)">
                <p v-if="ack.names">Names: <strong>{{ack.names}}</strong></p>
                <p v-if="ack.organization">Organization: <strong>{{ack.organization}}</strong></p>
                <p v-if="ack.summary">Summary: <strong>{{ack.summary}}</strong></p>
                <p v-if="ack.urls">URLs: <strong>{{ack.urls}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['acknowledgements']
}
</script>