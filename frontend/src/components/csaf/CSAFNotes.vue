// component for visualizing the notes property of the csaf document
<template>
    <Panel header="Notes" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="note.text" v-for="note of notes" :header="(note.title) ? note.title : 'Note'">
                <p v-if="note.title">Title: <strong>{{note.title}}</strong></p>
                <p v-if="note.text">Text: <strong>{{note.text}}</strong></p>
                <p v-if="note.category">Category: <strong>{{note.category}}</strong></p>
                <p v-if="note.audience">Audience: <strong>{{note.audience}}</strong></p>
            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
export default {
    props: ['notes']
}
</script>