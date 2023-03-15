// component for visualizing the references property of the csaf document
<template>
    <Panel header="References" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="ref.url" v-for="ref of references" :header="ref.url">
                <p v-if="ref.summary">Summary: <strong>{{ref.summary}}</strong></p>
                <p v-if="ref.category">Category: <strong>{{ref.category}}</strong></p>
                <p v-if="ref.url">URL: <strong>{{ref.url}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['references']
}
</script>