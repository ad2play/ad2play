// component for presenting the signatures of the playbook
<template>
    <Panel header="Signatures" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="sig.id" v-for="sig of signatures" :header="sig.id">
                <p v-if="sig.name">Name: <strong>{{sig.name}}</strong></p>
                <p v-if="sig.id">ID: <strong>{{sig.id}}</strong></p>
                <p v-if="sig.spec_version">Spec Version: <strong>{{sig.spec_version}}</strong></p>
                <p v-if="sig.created_by">Created By: <strong>{{sig.created_by}}</strong></p>
                <p v-if="sig.created">Created: <strong>{{(sig.created != null) ? new Date(sig.created).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="sig.modified">Modified: <strong>{{(sig.modified != null) ? new Date(sig.modified).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="sig.revoked">Revoked: <strong>{{sig.revoked}}</strong></p>
                <p v-if="sig.signee">Signee: <strong>{{sig.signee}}</strong></p>
                <p v-if="sig.valid_from">Valid from: <strong>{{(sig.valid_from != null) ? new Date(sig.valid_from).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="sig.valid_until">Valid until: <strong>{{(sig.valid_until != null) ? new Date(sig.valid_until).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="sig.related_to">Related to: <strong>{{sig.related_to}}</strong></p>
                <p v-if="sig.sha256">SHA256: <strong>{{sig.sha256}}</strong></p>
                <p v-if="sig.algorithm">Algorithm: <strong>{{sig.algorithm}}</strong></p>
                <p v-if="sig.public_keys.length !== 0">Public keys: <strong>{{sig.public_keys}}</strong></p>
                <p v-if="sig.cert_url">CERT URL: <strong>{{sig.cert_url}}</strong></p>
                <p v-if="sig.thumbprint">Thumbprint: <strong>{{sig.thumbprint}}</strong></p>
                <p v-if="sig.value">Value: <strong>{{sig.value}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['signatures']
}
</script>