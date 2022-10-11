// component for embedding the visualizer for the csaf document -> main entry point
<template>
    <Panel :header="header" :toggleable="true" v-if="infoVisible">
        <div>
            <CSAFVisualizer :csaf="csaf"></CSAFVisualizer>
        </div>
    </Panel>
</template>

<script>
import CSAFVisualizer from './CSAFVisualizer.vue';

export default {
    props: ['id'],
    components: {
        CSAFVisualizer
    },
	data() {
		return {
            infoVisible: false,
            header: 'CSAF Document: ' + this.id
		}
	},
    computed: {
        csaf() {
            return this.$store.getters['csaf/getById'](this.id);
        }
    },
    methods: {
        async fetchData() {
            try {
                await this.$store.dispatch('csaf/get', {_id: this.id});
                
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