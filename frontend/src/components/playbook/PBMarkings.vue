// component for presenting the data markings of the playbook
<template>
    <Panel header="Data Markings" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="key" v-for="(value, key) in markings" :header="key">
                <p v-if="value.type">Type: <strong>{{value.type}}</strong></p>
                <p v-if="value.name">Name: <strong>{{value.name}}</strong></p>
                <p v-if="value.description">Description: <strong>{{value.description}}</strong></p>
                <p v-if="value.created_by">Created by: <strong>{{value.created_by}}</strong></p>
                <p v-if="value.created">Created: <strong>{{(value.created != null) ? new Date(value.created).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="value.modified">Modified: <strong>{{(value.modified != null) ? new Date(value.modified).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="value.revoked">Revoked: <strong>{{value.revoked}}</strong></p>
                <p v-if="value.valid_from">Valid from: <strong>{{(value.valid_from != null) ? new Date(value.valid_from).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="value.valid_until">Valid until: <strong>{{(value.valid_until != null) ? new Date(value.valid_until).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="value.labels.length !== 0">Labels: <strong>{{value.labels}}</strong></p>
                <p v-if="value.statement">statement: <strong>{{value.statement}}</strong></p>
                <p v-if="value.tlp_level">TLP level: <strong>{{value.tlp_level}}</strong></p>
                <p v-if="value.iep_level">IEP level: <strong>{{value.iep_level}}</strong></p>
                <p v-if="value.start_date">Start date: <strong>{{(value.start_date != null) ? new Date(value.start_date).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="value.end_date">End date: <strong>{{(value.end_date != null) ? new Date(value.end_date).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="value.encrypt_in_transit">Encrypt in transit: <strong>{{value.encrypt_in_transit}}</strong></p>
                <p v-if="value.permitted_actions">Permitted actions: <strong>{{value.permitted_actions}}</strong></p>
                <p v-if="value.attribution">Attribution: <strong>{{value.attribution}}</strong></p>
                <p v-if="value.unmodified_resale">Unmodified resale: <strong>{{value.unmodified_resale}}</strong></p>

                <PBExternalReferences v-if="value.external_references.length !== 0" :references="value.external_references"></PBExternalReferences>

                <PBExtensions v-if="value.marking_extensions" :extensions="value.marking_extensions"></PBExtensions>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
import PBExtensions from './PBExtensions.vue';
import PBExternalReferences from './PBExternalReferences.vue';

export default {
    props: ['markings'],
    components: {
        PBExtensions,
        PBExternalReferences
    }
}
</script>