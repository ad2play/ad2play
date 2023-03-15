// component for presenting the general information of the playbook
<template>
    <div>
        <Panel header="MetaData" :toggleable="true" :collapsed="true">
            <p v-if="playbook._id">ID: <strong>{{playbook.id}}</strong></p>
            <p v-if="playbook.type">Type: <strong>{{playbook.type}}</strong></p>
            <p v-if="playbook.spec_version">Spec Version: <strong>{{playbook.spec_version}}</strong></p>
            <p v-if="playbook.name">Name: <strong>{{playbook.name}}</strong></p>
            <p v-if="playbook.description">Decription: <strong>{{playbook.description}}</strong></p>
            <p v-if="playbook.playbook_types">Playbook Types: <strong>{{playbook.playbook_types}}</strong></p>
            <p v-if="playbook.created_by">Created by: <strong>{{playbook.created_by}}</strong></p>
            <p v-if="playbook.created">Created: <strong>{{(playbook.created != null) ? new Date(playbook.created).toLocaleDateString("locale") : ''}}</strong></p>
            <p v-if="playbook.modified">Modified: <strong>{{(playbook.modified != null) ? new Date(playbook.modified).toLocaleDateString("locale") : ''}}</strong></p>
            <p v-if="playbook.revoked">Revoked: <strong>{{playbook.revoked}}</strong></p>
            <p v-if="playbook.valid_from">Valid from: <strong>{{(playbook.valid_from != null) ? new Date(playbook.valid_from).toLocaleDateString("locale") : ''}}</strong></p>
            <p v-if="playbook.valid_until">Valid until: <strong>{{(playbook.valid_until != null) ? new Date(playbook.valid_until).toLocaleDateString("locale") : ''}}</strong></p>
            <p v-if="playbook.derived_from.length !== 0">Derived from: <strong>{{playbook.derived_from}}</strong></p>
            <p v-if="playbook.priority">Priority: <strong>{{playbook.priority}}</strong></p>
            <p v-if="playbook.severity">Severity: <strong>{{playbook.severity}}</strong></p>
            <p v-if="playbook.impact">Impact: <strong>{{playbook.impact}}</strong></p>
            <p v-if="playbook.labels.length !== 0">Labels: <strong>{{playbook.labels}}</strong></p>
            <p v-if="playbook.markings.length !== 0">Markings: <strong>{{playbook.markings}}</strong></p>
            <p v-if="playbook.__v">Document Version: <strong>{{playbook.__v}}</strong></p>
            <p v-if="playbook.workflow_start">Workflow start: <strong>{{playbook.workflow_start}}</strong></p>
            <p v-if="playbook.workflow_exception">Workflow exception: <strong>{{playbook.workflow_exception}}</strong></p>
        </Panel>
    </div>
</template>

<script>
export default {
    props: ['playbook']
}
</script>