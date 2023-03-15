// component for visualizing the distribution of the csaf document
<template>
    <Panel header="Distribution" :toggleable="true" :collapsed="true">
        <p v-if="distribution.text">Text: <strong>{{distribution.text}}</strong></p>
        <div v-if="distribution.tlp">
            <p v-if="distribution.tlp.label">TLP label: <strong>{{distribution.tlp.label}}</strong></p>
            <p v-if="distribution.tlp.url">TLP URL: <strong>{{distribution.tlp.url}}</strong></p>
        </div>
    </Panel>
</template>

<script>
export default {
    props: ['distribution']
}
</script>