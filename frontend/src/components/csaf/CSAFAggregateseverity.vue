// component for visualizing the aggregate severity property of the csaf document
<template>
    <Panel header="Aggregate Severity" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="aggs.text" v-for="aggs of aggregateseveritiy" header="Severity">
                <p v-if="aggs.text">Text: <strong>{{aggs.text}}</strong></p>
                <p v-if="aggs.namespace">Namespace: <strong>{{aggs.namespace}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['aggregateseveritiy']
}
</script>