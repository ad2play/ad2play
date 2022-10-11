// component for presenting the workflow of the playbook
<template>
    <Panel header="Workflow" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="key" v-for="(value, key) in workflow" :header="key">
                <p v-if="value.type">Type: <strong>{{value.type}}</strong></p>
                <p v-if="value.name">Name: <strong>{{value.name}}</strong></p>
                <p v-if="value.description">Description: <strong>{{value.description}}</strong></p>
                <p v-if="value.delay">Delay: <strong>{{value.delay}}</strong></p>
                <p v-if="value.timeout">Timeout: <strong>{{value.timeout}}</strong></p>
                <p v-if="value.owner">Owner: <strong>{{value.owner}}</strong></p>
                <p v-if="value.on_completion">On completion: <strong>{{value.on_completion}}</strong></p>
                <p v-if="value.on_success">On success: <strong>{{value.on_success}}</strong></p>
                <p v-if="value.target_ids.length !== 0">Target IDs: <strong>{{value.target_ids}}</strong></p>
                <p v-if="value.in_args.length !== 0">In args: <strong>{{value.in_args}}</strong></p>
                <p v-if="value.out_args.length !== 0">Out args: <strong>{{value.out_args}}</strong></p>
                <p v-if="value.playbook_id">Playbook ID: <strong>{{value.playbook_id}}</strong></p>
                <p v-if="value.next_steps.length !== 0">Next steps: <strong>{{value.next_steps}}</strong></p>
                <p v-if="value.condition">Condition: <strong>{{value.condition}}</strong></p>
                <p v-if="value.on_true.length !== 0">On true: <strong>{{value.on_true}}</strong></p>
                <p v-if="value.on_false.length !== 0">On false: <strong>{{value.on_false}}</strong></p>
                <p v-if="value.switch">Switch: <strong>{{value.switch}}</strong></p>

                <PBCases v-if="value.cases" :cases="value.cases"></PBCases>

                <PBExternalReferences v-if="value.external_references.length !== 0" :references="value.external_references"></PBExternalReferences>

                <PBExtensions v-if="value.step_extensions" :extensions="value.step_extensions"></PBExtensions>

                <PBTargets v-if="value.target" :targets="{'Target': value.target}"></PBTargets>

                <PBVariables v-if="value.step_variables" :variables="value.step_variables"></PBVariables>

                <PBCommands v-if="value.commands.length !== 0" :commands="value.commands"></PBCommands>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
import PBExternalReferences from './PBExternalReferences.vue';
import PBVariables from './PBVariables.vue';
import PBTargets from './PBTargets.vue';
import PBExtensions from './PBExtensions.vue';
import PBCommands from './PBCommands.vue';
import PBCases from './PBCases.vue';

export default {
    props: ['workflow'],
    components: {
        PBExternalReferences,
        PBVariables,
        PBTargets,
        PBExtensions,
        PBCommands,
        PBCases
    }
}
</script>