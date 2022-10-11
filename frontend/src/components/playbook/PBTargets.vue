// component for presenting the targets of the playbook
<template>
    <Panel :header="titleString" :toggleable="true" :collapsed="true">
        <Accordion  :activeIndex="0">
            <AccordionTab :key="key" v-for="(value, key) in targets" :header="key">
                <p v-if="value.type">Type: <strong>{{value.type}}</strong></p>
                <p v-if="value.name">Name: <strong>{{value.name}}</strong></p>
                <p v-if="value.description">Description: <strong>{{value.description}}</strong></p>
                <p v-if="value.logical.length !== 0">Logical: <strong>{{value.logical}}</strong></p>
                <p v-if="value.http_url">HTTP URL: <strong>{{value.http_url}}</strong></p>
                <p v-if="value.http_auth_type">HTTP AUTH type: <strong>{{value.http_auth_type}}</strong></p>
                <p v-if="value.user_id">User ID: <strong>{{value.user_id}}</strong></p>
                <p v-if="value.password">Password: <strong>{{value.password}}</strong></p>
                <p v-if="value.token">Token: <strong>{{value.token}}</strong></p>
                <p v-if="value.oauth_header">OAUTH header: <strong>{{value.oauth_header}}</strong></p>
                <p v-if="value.address">Address: <strong>{{value.address}}</strong></p>
                <p v-if="value.port">Port: <strong>{{value.port}}</strong></p>
                <p v-if="value.username">Username: <strong>{{value.username}}</strong></p>
                <p v-if="value.private_key">Private key: <strong>{{value.private_key}}</strong></p>
                <p v-if="value.category.length !== 0">Category: <strong>{{value.category}}</strong></p>
                <p v-if="value.executor_type">Executor type: <strong>{{value.executor_type}}</strong></p>
                <p v-if="value.agent_type">Agent type: <strong>{{value.agent_type}}</strong></p>

                <PBTargets v-if="value.executor" :targets="[value.executor]" title="Executor"></PBTargets>

                <PBTargets v-if="value.subject" :targets="[value.subject]" title="Subject"></PBTargets>

                <Panel header="Contact" :toggleable="true" v-if="value.contact" :collapsed="true">
                    <p v-if="value.contact.email">Email: <strong>{{value.contact.email}}</strong></p>
                    <p v-if="value.contact.phone">Phone: <strong>{{value.contact.phone}}</strong></p>
                    <p v-if="value.contact.contact_details">Contect details: <strong>{{value.contact.contact_details}}</strong></p>
                </Panel>

                <div v-if="value.location">
                    <div v-if="value.type !== 'sector'">
                        <Panel header="Location" :toggleable="true" :collapsed="true">
                            <p v-if="value.location.description">Description: <strong>{{value.location.description}}</strong></p>
                            <p v-if="value.location.building_details">Building details: <strong>{{value.location.building_details}}</strong></p>
                            <p v-if="value.location.network_details">network_details details: <strong>{{value.location.network_details}}</strong></p>
                            <p v-if="value.location.region">Region: <strong>{{value.location.region}}</strong></p>
                            <p v-if="value.location.country">Country: <strong>{{value.location.country}}</strong></p>
                            <p v-if="value.location.administrative_area">Administrative area: <strong>{{value.location.administrative_area}}</strong></p>
                            <p v-if="value.location.city">City: <strong>{{value.location.city}}</strong></p>
                            <p v-if="value.location.street_address">Street address: <strong>{{value.location.street_address}}</strong></p>
                            <p v-if="value.location.postal_code">Postal code: <strong>{{value.location.postal_code}}</strong></p>
                        </Panel>
                    </div>

                    <div v-if="value.type === 'sector'">
                        <Panel header="Locations" :toggleable="true" :collapsed="true">
                            <Accordion  :activeIndex="0">
                                <AccordionTab :key="index" v-for="(loc, index) of value.location" :header="index + 1">
                                    <p v-if="loc.description">Description: <strong>{{loc.description}}</strong></p>
                                    <p v-if="loc.building_details">Building details: <strong>{{loc.building_details}}</strong></p>
                                    <p v-if="loc.network_details">network_details details: <strong>{{loc.network_details}}</strong></p>
                                    <p v-if="loc.region">Region: <strong>{{loc.region}}</strong></p>
                                    <p v-if="loc.country">Country: <strong>{{loc.country}}</strong></p>
                                    <p v-if="loc.administrative_area">Administrative area: <strong>{{loc.administrative_area}}</strong></p>
                                    <p v-if="loc.city">City: <strong>{{loc.city}}</strong></p>
                                    <p v-if="loc.street_address">Street address: <strong>{{loc.street_address}}</strong></p>
                                    <p v-if="loc.postal_code">Postal code: <strong>{{loc.postal_code}}</strong></p>
                                </AccordionTab>
                            </Accordion>
                        </Panel>
                    </div>
                </div>

                <Panel header="GPS" :toggleable="true" v-if="value.gps" :collapsed="true">
                    <p v-if="value.gps.latitude">Latitude: <strong>{{value.gps.latitude}}</strong></p>
                    <p v-if="value.gps.longitude">Longitude: <strong>{{value.gps.longitude}}</strong></p>
                    <p v-if="value.gps.precision">Precision: <strong>{{value.gps.precision}}</strong></p>
                </Panel>

                <PBExtensions v-if="value.target_extensions" :extensions="value.target_extensions"></PBExtensions>

            </AccordionTab>
        </Accordion>
    </Panel>
</template>

<script>
import PBExtensions from './PBExtensions.vue';

export default {
    props: ['targets', 'title'],
    name: 'PBTargets',
    components: {
        PBExtensions
    },
    computed: {
        titleString() {
            if (this.title) {
                return this.title;
            } else {
                return 'Targets'
            }
        }
    }
}
</script>