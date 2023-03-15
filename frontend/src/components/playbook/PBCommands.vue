// component for presenting the commands of the playbook
<template>
    <Panel header="Commands" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="index" v-for="(value, index) of commands" :header="index + 1">
                <p v-if="value.type">Type: <strong>{{value.type}}</strong></p>
                <p v-if="value.command">Command: <strong>{{value.command}}</strong></p>
                <p v-if="value.command_b64">Command_b64: <strong>{{value.command_b64}}</strong></p>
                <p v-if="value.version">Version: <strong>{{value.version}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['commands']
}
</script>