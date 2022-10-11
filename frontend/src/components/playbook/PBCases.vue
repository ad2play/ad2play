// component for presenting the content of the cases property of the playbook
<template>
    <Panel header="Cases" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="key" v-for="(value, key) in cases" :header="key">
                <p v-if="value">Steps: <strong>{{value.toString()}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['cases']
}
</script>