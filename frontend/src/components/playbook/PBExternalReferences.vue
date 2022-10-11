// component for presenting the external references of the playbook
<template>
    <Panel header="External References" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="ref.name" v-for="ref of references" :header="ref.name">
                <p v-if="ref.name">Name: <strong>{{ref.name}}</strong></p>
                <p v-if="ref.description">Description: <strong>{{ref.description}}</strong></p>
                <p v-if="ref.source">Source: <strong>{{ref.source}}</strong></p>
                <p v-if="ref.url">URL: <strong>{{ref.url}}</strong></p>
                <p v-if="ref.external_id">External ID: <strong>{{ref.external_id}}</strong></p>
                <p v-if="ref.reference_id">Reference ID: <strong>{{ref.reference_id}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['references']
}
</script>