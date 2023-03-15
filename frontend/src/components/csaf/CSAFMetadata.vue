// component for visualizing the general document properties of the csaf document
<template>
    <div>
        <Panel header="MetaData" :toggleable="true" :collapsed="true">
            <p v-if="csaf.category">Category: <strong>{{csaf.category}}</strong></p>
            <p v-if="csaf.csaf_version">CSAF Version: <strong>{{csaf.csaf_version}}</strong></p>
            <p v-if="csaf.source_lang">Source lang: <strong>{{csaf.source_lang}}</strong></p>
            <p v-if="csaf.lang">Lang: <strong>{{csaf.lang}}</strong></p>
        </Panel>
    </div>
</template>

<script>
export default {
    props: ['csaf']
}
</script>