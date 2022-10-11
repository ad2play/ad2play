// component for visualizing the publisher property of the csaf document
<template>
    <Panel header="Publisher" :toggleable="true" :collapsed="true">
        <p v-if="publisher.name">Name: <strong>{{publisher.name}}</strong></p>
        <p v-if="publisher.namespace">Namespace: <strong>{{publisher.namespace}}</strong></p>
        <p v-if="publisher.category">Category: <strong>{{publisher.category}}</strong></p>
        <p v-if="publisher.contact_details">Contact details: <strong>{{publisher.contact_details}}</strong></p>
        <p v-if="publisher.issuing_authority">Issuing authority: <strong>{{publisher.issuing_authority}}</strong></p>
    </Panel>
</template>

<script>
export default {
    props: ['publisher']
}
</script>