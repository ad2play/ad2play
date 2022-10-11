// subcomponent for visualizing the single branches of the product tree of the csaf document
<template>
    <div v-if="branches.length !== 0">
        <Panel header="Branches" :toggleable="true" :collapsed="true">
            <Accordion :activeIndex="0">
                <AccordionTab :key="branch.name" v-for="branch of branches" :header="branch.name">
                    <p v-if="branch.category">Category: <strong>{{branch.category}}</strong></p>
                    <p v-if="branch.name">Name: <strong>{{branch.name}}</strong></p>

                    <div class="info" v-if="branch.product">
                        <Panel header="Product" :toggleable="true" :collapsed="true">
                            <p v-if="branch.product.name">Name: <strong>{{branch.product.name}}</strong></p>
                            <p v-if="branch.product.product_id">Product ID: <strong>{{branch.product.product_id}}</strong></p>
                            <p v-if="branch.product.product_identification_helper">Product identification helper: <strong>{{branch.product.product_identification_helper}}</strong></p>
                        </Panel>
                    </div>

                    <!-- this component recursively calls itself -->
                    <CSAFBranch :branches="branch.branches"></CSAFBranch>
                </AccordionTab>
            </Accordion>
        </Panel>
    </div>
</template>

<script>
export default {
    props: ['branches'],
    name: 'CSAFBranch'
}
</script>

<style>
    .info {
        padding-bottom: 1rem;
    }
</style>