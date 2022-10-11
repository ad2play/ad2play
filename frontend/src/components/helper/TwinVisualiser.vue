// subcomponent for putting the twins' information in a accordion tab for better presentation
<template>
    <Accordion  :activeIndex="0">
        <AccordionTab :key="twin.thingId" v-for="twin of data" :header="twin.thingId">
            <pre v-html="JSON.stringify(twin, null, 2)"></pre>
        </AccordionTab>
    </Accordion>
</template>

<script>
export default {
    props: ['data']
}
</script>