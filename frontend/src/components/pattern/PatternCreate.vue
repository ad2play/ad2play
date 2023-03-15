// component for creating patterns
<template>
    <div class="card">
        <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">     
            <span class="p-input-icon-right">
                <Button @click="$router.push({ name: 'patternlist' });">Back</Button>
            </span>
        </div>
    </div>

	<div>
        <div class="card">
            <div>
                <PatternForm @pattern-submit="createPattern"></PatternForm>
            </div>
        </div>
    </div>
</template>

<script>
import PatternForm from './PatternForm.vue'

export default {
    components: {
        PatternForm
    },
    methods: {
        async createPattern(data) { // when the subcomponent emits the event this method is called and created the pattern
            try {
                await this.$store.dispatch('pattern/create', data);
                const patternId = this.$store.getters['pattern/getRecentCreated']._id;

                this.$router.push({ name: 'singlepatternview', params: { id: patternId }}).then(() => {
                        this.$toast.add({ severity: 'success', summary: 'Pattern created!', life: 2000 });
                });
            }catch(error) {
                this.$toast.add({severity:'error', summary: 'Error while creating pattern!', life: 2000});
            }
        }
    }	
}
</script>