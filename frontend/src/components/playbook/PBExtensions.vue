// component for presenting the extensions of the playbook
<template>
    <Panel header="Extensions" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="key" v-for="(value, key) in extensions" :header="key">
                <p v-if="value.type">Type: <strong>{{value.type}}</strong></p>
                <p v-if="value.name">Name: <strong>{{value.name}}</strong></p>
                <p v-if="value.description">Description: <strong>{{value.description}}</strong></p>
                <p v-if="value.created_by">Created by: <strong>{{value.created_by}}</strong></p>
                <p v-if="value.schema">Schema: <strong>{{value.schema}}</strong></p>
                <p v-if="value.version">Version: <strong>{{value.version}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['extensions']
}
</script>