// component for visualizing the vulnerabilities of the csaf document
<template>
    <Panel header="Vulnerabilities" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="vulnerabilities.indexOf(vul)" v-for="vul of vulnerabilities" :header="(vul.title) ? vul.title : 'Vulnerability'">
                <p v-if="vul.cve">CVE: <strong>{{vul.cve}}</strong></p>
                <p v-if="vul.discovery_date">Discovery date: <strong>{{(vul.discovery_date != null) ? new Date(vul.discovery_date).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="vul.release_date">Release date: <strong>{{(vul.release_date != null) ? new Date(vul.release_date).toLocaleDateString("locale") : ''}}</strong></p>
                <p v-if="vul.title">Title: <strong>{{vul.title}}</strong></p>

                <div v-if="vul.cwe">
                    <p v-if="vul.cwe.id">CWE ID: <strong>{{vul.cwe.id}}</strong></p>
                    <p v-if="vul.cwe.name">CWE name: <strong>{{vul.cwe.name}}</strong></p>
                </div>

                <div class="info" v-if="vul.acknowledgements.length !== 0">
                    <CSAFAcknowledgements :acknowledgements="vul.acknowledgements"></CSAFAcknowledgements>
                </div>

                <div class="info" v-if="vul.flags.length !== 0">
                    <Panel header="Flags" :toggleable="true" :collapsed="true">
                        <Accordion :activeIndex="0">
                            <AccordionTab :key="flag.label" v-for="flag of vul.flags" :header="flag.label">
                                <p v-if="flag.date">Date: <strong>{{(flag.date != null) ? new Date(flag.date).toLocaleDateString("locale") : ''}}</strong></p>
                                <p v-if="flag.group_ids">Group IDs: <strong>{{flag.group_ids}}</strong></p>
                                <p v-if="flag.product_ids">Product IDs: <strong>{{flag.product_ids}}</strong></p>
                                <p v-if="flag.label">Label: <strong>{{flag.label}}</strong></p>
                            </AccordionTab>
                        </Accordion>
                    </Panel>
                </div>

                <div class="info" v-if="vul.ids.length !== 0">
                    <Panel header="IDs" :toggleable="true" :collapsed="true">
                        <Accordion :activeIndex="0">
                            <AccordionTab :key="id.system_name" v-for="id of vul.ids" :header="id.system_name">
                                <p v-if="id.text">Text: <strong>{{id.text}}</strong></p>
                                <p v-if="id.system_name">System name: <strong>{{id.system_name}}</strong></p>
                            </AccordionTab>
                        </Accordion>
                    </Panel>
                </div>

                <div class="info" v-if="vul.involvements.length !== 0">
                    <Panel header="Involvements" :toggleable="true" :collapsed="true">
                        <Accordion :activeIndex="0">
                            <AccordionTab :key="involvement.party" v-for="involvement of vul.involvements" :header="involvement.party">
                                <p v-if="involvement.date">Date: <strong>{{(involvement.date != null) ? new Date(involvement.date).toLocaleDateString("locale") : ''}}</strong></p>
                                <p v-if="involvement.party">Party: <strong>{{involvement.party}}</strong></p>
                                <p v-if="involvement.status">Status: <strong>{{involvement.status}}</strong></p>
                                <p v-if="involvement.summary">Summary: <strong>{{involvement.summary}}</strong></p>
                            </AccordionTab>
                        </Accordion>
                    </Panel>
                </div>

                <div class="info" v-if="vul.notes.length !== 0">
                    <CSAFNotes :notes="vul.notes"></CSAFNotes>
                </div>

                <div class="info" v-if="vul.product_status">
                    <Panel header="Product Status" :toggleable="true" :collapsed="true">
                        <p v-if="vul.product_status.first_affected.length !== 0">First affected: <strong>{{vul.product_status.first_affected}}</strong></p>
                        <p v-if="vul.product_status.first_fixed.length !== 0">First fixed: <strong>{{vul.product_status.first_fixed}}</strong></p>
                        <p v-if="vul.product_status.fixed.length !== 0">Fixed: <strong>{{vul.product_status.fixed}}</strong></p>
                        <p v-if="vul.product_status.known_affected.length !== 0">Known affected: <strong>{{vul.product_status.known_affected}}</strong></p>
                        <p v-if="vul.product_status.known_not_affected.length !== 0">Known not affected: <strong>{{vul.product_status.known_not_affected}}</strong></p>
                        <p v-if="vul.product_status.last_affected.length !== 0">Last affected: <strong>{{vul.product_status.last_affected}}</strong></p>
                        <p v-if="vul.product_status.recommended.length !== 0">Recommended: <strong>{{vul.product_status.recommended}}</strong></p>
                        <p v-if="vul.product_status.under_investigation.length !== 0">Under Investigation: <strong>{{vul.product_status.under_investigation}}</strong></p>
                    </Panel>
                </div>

                <div class="info" v-if="vul.references.length !== 0">
                    <CSAFReferences :references="vul.references"></CSAFReferences>
                </div>

                <div class="info" v-if="vul.remediations.length !== 0">
                    <Panel header="Remediations" :toggleable="true" :collapsed="true">
                        <Accordion :activeIndex="0">
                            <AccordionTab :key="remedy.category" v-for="remedy of vul.remediations" :header="remedy.category">
                                <p v-if="remedy.details">Details: <strong>{{remedy.details}}</strong></p>
                                <p v-if="remedy.date">Date: <strong>{{(remedy.date != null) ? new Date(remedy.date).toLocaleDateString("locale") : ''}}</strong></p>
                                <p v-if="remedy.category">Category: <strong>{{remedy.category}}</strong></p>
                                <p v-if="remedy.entitlements.length !== 0">Entitlements: <strong>{{remedy.entitlements}}</strong></p>
                                <p v-if="remedy.group_ids.length !== 0">Group IDs: <strong>{{remedy.group_ids}}</strong></p>
                                <p v-if="remedy.product_ids.length !== 0">Product IDs: <strong>{{remedy.product_ids}}</strong></p>
                                <p v-if="remedy.product_ids.length !== 0">Product Names: <strong>{{getProductNames(remedy.product_ids)}}</strong></p>
                                <p v-if="remedy.url">URL: <strong>{{remedy.url}}</strong></p>

                                <div v-if="remedy.restart_required">
                                    <p v-if="remedy.restart_required.category">Restart category: <strong>{{remedy.restart_required.category}}</strong></p>
                                    <p v-if="remedy.restart_required.details">Restart details: <strong>{{remedy.restart_required.details}}</strong></p>
                                </div>
                            </AccordionTab>
                        </Accordion>
                    </Panel>
                </div>

                <div class="info" v-if="vul.scores.length !== 0">
                    <Panel header="Scores" :toggleable="true" :collapsed="true">
                        <Accordion :activeIndex="0">
                            <AccordionTab :key="vul.scores.indexOf(sco)" v-for="sco of vul.scores" header="Score">
                                <p v-if="sco.products">Products: <strong>{{sco.products}}</strong></p>

                                <div class="info" v-if="sco.cvss_v2">
                                    <Panel header="CVSS v2" :toggleable="true" :collapsed="true">
                                        <p v-if="sco.cvss_v2.version">Version: <strong>{{sco.cvss_v2.version}}</strong></p>
                                        <p v-if="sco.cvss_v2.baseScore">Base score: <strong>{{sco.cvss_v2.baseScore}}</strong></p>
                                        <p v-if="sco.cvss_v2.baseSeverity">Base Severity: <strong>{{sco.cvss_v2.baseSeverity}}</strong></p>
                                        <p v-if="sco.cvss_v2.vectorString">Vector String: <strong>{{sco.cvss_v2.vectorString}}</strong></p>
                                    </Panel>
                                </div>

                                <div class="info" v-if="sco.cvss_v3">
                                    <Panel header="CVSS v3" :toggleable="true" :collapsed="true">
                                        <p v-if="sco.cvss_v3.version">Version: <strong>{{sco.cvss_v3.version}}</strong></p>
                                        <p v-if="sco.cvss_v3.baseScore">Base score: <strong>{{sco.cvss_v3.baseScore}}</strong></p>
                                        <p v-if="sco.cvss_v3.baseSeverity">Base Severity: <strong>{{sco.cvss_v3.baseSeverity}}</strong></p>
                                        <p v-if="sco.cvss_v3.vectorString">Vector String: <strong>{{sco.cvss_v3.vectorString}}</strong></p>
                                    </Panel>
                                </div>
                            </AccordionTab>
                        </Accordion>
                    </Panel>
                </div>

                <div class="info" v-if="vul.threats.length !== 0">
                    <Panel header="Threats" :toggleable="true" :collapsed="true">
                        <Accordion :activeIndex="0">
                            <AccordionTab :key="thr.category" v-for="thr of vul.threats" :header="thr.category">
                                <p v-if="thr.details">Details: <strong>{{thr.details}}</strong></p>
                                <p v-if="thr.date">Date: <strong>{{(thr.date != null) ? new Date(thr.date).toLocaleDateString("locale") : ''}}</strong></p>
                                <p v-if="thr.category">Category: <strong>{{thr.category}}</strong></p>
                                <p v-if="thr.group_ids">Group IDs: <strong>{{thr.group_ids}}</strong></p>
                                <p v-if="thr.product_ids">Product IDs: <strong>{{thr.product_ids}}</strong></p>
                            </AccordionTab>
                        </Accordion>
                    </Panel>
                </div>

            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
import CSAFAcknowledgements from './CSAFAcknowledgements.vue';
import CSAFNotes from './CSAFNotes.vue';
import CSAFReferences from './CSAFReferences.vue';

export default {
    props: ['vulnerabilities', 'productTree'],
    components: {
        CSAFAcknowledgements,
        CSAFNotes,
        CSAFReferences
    },
    methods: {
        getProductNames(ids) {
            const prodTree = this.productTree;
            if (!prodTree) {
                return null;
            }
            const ret = [];

            for (const id of ids) {
                for (const branch of prodTree.branches) {
                    ret.push(this.searchTree(branch, id))
                }
            }
            return ret;
        },
        searchTree(element, id) { // method that searches the tree for a specific id and returns the product name
            if (element.product) {
                if (element.product.product_id === id) {
                    return element.product.name;
                }
            }

            if (element.branches) {
                let result = null;
                for (let i = 0; result == null && i < element.branches.length; i++) {
                    result = this.searchTree(element.branches[i], id); // recursive method
                }
                return result;
            }
            return null;
        }
    }
}
</script>

<style>
    .info {
        padding-bottom: 1rem;
    }
</style>