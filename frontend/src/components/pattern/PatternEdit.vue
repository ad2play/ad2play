// component for editing an existing pattern
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
                <PatternForm @pattern-submit="editPattern" :editId="id"></PatternForm>
            </div>
        </div>
    </div>
</template>

<script>
import PatternForm from './PatternForm.vue'

export default {
    props: ['id'],
    components: {
        PatternForm
    },
    methods: {
        async editPattern(data) { // when the subcomponent emits the event this method is called and the pattern is updated
            try {
                await this.$store.dispatch('pattern/update', {...data, _id: this.id});

                this.$router.push({ name: 'singlepatternview', params: { id: this.id }}).then(() => {
                        this.$toast.add({ severity: 'success', summary: 'Pattern updated!', life: 2000 });
                });
                // console.log(data)
            }catch(error) {
                this.$toast.add({severity:'error', summary: 'Error while updating pattern!', life: 2000});
            }
        }
    }	
}
</script>