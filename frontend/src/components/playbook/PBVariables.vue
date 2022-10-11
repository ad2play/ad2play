// component for presenting the variables of the playbook
<template>
    <Panel header="Playbook Variables" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="key" v-for="(value, key) in variables" :header="key">
                <p v-if="value.type">Type: <strong>{{value.type}}</strong></p>
                <p v-if="value.description">Description: <strong>{{value.description}}</strong></p>
                <p v-if="value.value">Value: <strong>{{value.value}}</strong></p>
                <p v-if="value.constant">Constant: <strong>{{value.constant}}</strong></p>
                <p v-if="value.external">External: <strong>{{value.external}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['variables']
}
</script>