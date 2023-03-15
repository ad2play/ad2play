// simple presentation component for showing the user the exact implementation of the digital twins
<template>
    <h2> Digital Twins</h2>
    <div class="card" v-if="visible">
        <TwinVisualiser :data="twins"></TwinVisualiser>
    </div>    
</template>

<script>
import TwinVisualiser from './TwinVisualiser.vue';

export default {
    components: {
        TwinVisualiser
    },
	data() {
		return {
            visible: false
		}
	},
    computed: {
        twins() {
            return this.$store.getters['twin/list'];
        }
    },
    methods: {
        async fetchData() {
            try{
                await this.$store.dispatch('twin/fetchAll', {
                    forceRefresh: true
                });
                this.visible = true;
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.fetchData();
    }	
}
</script>