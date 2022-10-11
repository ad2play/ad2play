// component for visualizing the product tree of the csaf document
<template>
    <Panel header="Product Tree" :toggleable="true" :collapsed="true">
        <div v-if="producttree.branches.length !== 0">
            <Panel header="Branches" :toggleable="true" :collapsed="true">
                <Accordion :activeIndex="0">
                    <AccordionTab :key="bra.name" v-for="bra of producttree.branches" :header="bra.name">
                        <p v-if="bra.category">Category: <strong>{{bra.category}}</strong></p>
                        <p v-if="bra.name">Name: <strong>{{bra.name}}</strong></p>

                        <div class="info" v-if="bra.product">
                            <Panel header="Product" :toggleable="true">
                                <p v-if="bra.product.name">Name: <strong>{{bra.product.name}}</strong></p>
                                <p v-if="bra.product.product_id">Product ID: <strong>{{bra.product.product_id}}</strong></p>
                                <p v-if="bra.product.product_identification_helper">Product identification helper: <strong>{{bra.product.product_identification_helper}}</strong></p>
                            </Panel>
                        </div>

                        <CSAFBranch :branches="bra.branches"></CSAFBranch>
                    </AccordionTab> 
                </Accordion>
            </Panel>
        </div>

        <div class="info" v-if="producttree.full_product_names.length !== 0">
            <Panel header="Full Product Names" :toggleable="true" :collapsed="true">
                <Accordion :activeIndex="0">
                    <AccordionTab :key="fpn.product_id" v-for="fpn of producttree.full_product_names" :header="fpn.product_id">
                        <p v-if="fpn.name">Name: <strong>{{fpn.name}}</strong></p>
                        <p v-if="fpn.product_id">Product ID: <strong>{{fpn.product_id}}</strong></p>
                        <p v-if="fpn.product_identification_helper">Product identification helper: <strong>{{fpn.product_identification_helper}}</strong></p>
                    </AccordionTab>
                </Accordion>
            </Panel>
        </div>

        <div class="info" v-if="producttree.product_groups.length !== 0">
            <Panel header="Product Groups" :toggleable="true" :collapsed="true">
                <Accordion :activeIndex="0">
                    <AccordionTab :key="prgr.group_id" v-for="prgr of producttree.product_groups" :header="prgr.group_id">
                        <p v-if="prgr.summary">Summary: <strong>{{prgr.summary}}</strong></p>
                        <p v-if="prgr.group_id">Group ID: <strong>{{prgr.group_id}}</strong></p>
                        <p v-if="prgr.product_ids">Product IDs: <strong>{{prgr.product_ids}}</strong></p>
                    </AccordionTab>
                </Accordion>
            </Panel>
        </div>

        <div v-if="producttree.relationships.length !== 0">
            <Panel header="Relationships" :toggleable="true" :collapsed="true">
                <Accordion :activeIndex="0">
                    <AccordionTab :key="rel.category" v-for="rel of producttree.relationships" :header="rel.category">
                        <p v-if="rel.full_product_name">Full Product Name: <strong>{{rel.full_product_name}}</strong></p>
                        <p v-if="rel.category">Category: <strong>{{rel.category}}</strong></p>
                        <p v-if="rel.product_references">Product references: <strong>{{rel.product_references}}</strong></p>
                        <p v-if="rel.relates_to_product_reference">Relates to product reference: <strong>{{rel.relates_to_product_reference}}</strong></p>
                    </AccordionTab>
                </Accordion>
            </Panel>
        </div>
    </Panel>
</template>

<script>
import CSAFBranch from './CSAFBranch.vue';

export default {
    props: ['producttree'],
    components: {
        CSAFBranch
    }
}
</script>

<style>
    .info {
        padding-bottom: 1rem;
    }
</style>