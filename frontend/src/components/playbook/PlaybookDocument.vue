// general component that embedds the playbook visualizer in order to display the content of a specific playbook
<template>
    <Panel :header="header" :toggleable="true" v-if="infoVisible">
        <div>
            <PlaybookVisualizer :playbook="playbook"></PlaybookVisualizer>
        </div>
    </Panel>
</template>

<script>
import PlaybookVisualizer from './PlaybookVisualizer.vue';

export default {
    props: ['id'],
    components: {
        PlaybookVisualizer
    },
	data() {
		return {
            infoVisible: false,
            header: 'Playbook Document: ' + this.id
		}
	},
    computed: {
        playbook() {
            return this.$store.getters['playbook/getById'](this.id);
        }
    },
    methods: {
        async fetchData() {
            try {
                await this.$store.dispatch('playbook/get', {_id: this.id});
                
                this.infoVisible = true
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
    }	
}
</script>