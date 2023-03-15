<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5 v-if="!noId">{{'CivLoc ' + id}}</h5>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the location.'"/>
                <small v-if="!description.isValid && description.required" id="description-help" class="p-error">Please input the description of the location!</small>
            </div>

            <div class="p-field">
                <label for="building_details">Building details</label>
                <InputText id="building_details" v-model.trim="building_details.val"
                @blur="clearValidity('building_details')" aria-describedby="building_details-help" v-tooltip.left="'Input field for the building_details of the location.'"/>
                <small v-if="!building_details.isValid && building_details.required" id="building_details-help" class="p-error">Please input the building_details of the location!</small>
            </div>

            <div class="p-field">
                <label for="network_details">Network details</label>
                <InputText id="network_details" v-model.trim="network_details.val"
                @blur="clearValidity('network_details')" aria-describedby="network_details-help" v-tooltip.left="'Input field for the network_details of the location.'"/>
                <small v-if="!network_details.isValid && network_details.required" id="network_details-help" class="p-error">Please input the network_details of the location!</small>
            </div>

            <div class="p-field">
                <label for="region">Region</label>
                <InputText id="region" v-model.trim="region.val"
                @blur="clearValidity('region')" aria-describedby="region-help" v-tooltip.left="'Input field for the region of the location.'"/>
                <small v-if="!region.isValid && region.required" id="region-help" class="p-error">Please input the region of the location!</small>
            </div>

            <div class="p-field">
                <label for="country">Country</label>
                <InputText id="country" v-model.trim="country.val"
                @blur="clearValidity('country')" aria-describedby="country-help" v-tooltip.left="'Input field for the country of the location.'"/>
                <small v-if="!country.isValid && country.required" id="country-help" class="p-error">Please input the country of the location!</small>
            </div>

            <div class="p-field">
                <label for="administrative_area">Administrative area</label>
                <InputText id="administrative_area" v-model.trim="administrative_area.val"
                @blur="clearValidity('administrative_area')" aria-describedby="administrative_area-help" v-tooltip.left="'Input field for the administrative_area of the location.'"/>
                <small v-if="!administrative_area.isValid && description.required" id="administrative_area-help" class="p-error">Please input the administrative_area of the location!</small>
            </div>

            <div class="p-field">
                <label for="city">City</label>
                <InputText id="city" v-model.trim="city.val"
                @blur="clearValidity('city')" aria-describedby="city-help" v-tooltip.left="'Input field for the city of the location.'"/>
                <small v-if="!city.isValid && city.required" id="city-help" class="p-error">Please input the city of the location!</small>
            </div>

            <div class="p-field">
                <label for="street_address">Street address</label>
                <InputText id="street_address" v-model.trim="street_address.val"
                @blur="clearValidity('street_address')" aria-describedby="street_address-help" v-tooltip.left="'Input field for the street_address of the location.'"/>
                <small v-if="!street_address.isValid && street_address.required" id="street_address-help" class="p-error">Please input the street_address of the location!</small>
            </div>

            <div class="p-field">
                <label for="postal_code">Postal code</label>
                <InputText id="postal_code" v-model.trim="postal_code.val"
                @blur="clearValidity('postal_code')" aria-describedby="postal_code-help" v-tooltip.left="'Input field for the postal_code of the location.'"/>
                <small v-if="!postal_code.isValid && postal_code.required" id="postal_code-help" class="p-error">Please input the postal_code of the location!</small>
            </div>
            
        </div>
    </form>
</template>

<script>
export default {
    emits: ["provide-civiclocation", "form-invalid"],
    props: ["edit", "trigger", "id", "noId", "initData"],
	data() {
		return {
            description: {
                val: '',
                isValid: true,
                required: false
            },
            building_details: {
                val: '',
                isValid: true,
                required: false
            },
            network_details: {
                val: '',
                isValid: true,
                required: false
            },
            region: {
                val: '',
                isValid: true,
                required: false
            },
            country: {
                val: '',
                isValid: true,
                required: false
            },
            administrative_area: {
                val: '',
                isValid: true,
                required: false
            },
            city: {
                val: '',
                isValid: true,
                required: false
            },
            street_address: {
                val: '',
                isValid: true,
                required: false
            },
            postal_code: {
                val: '',
                isValid: true,
                required: false
            }
        };
	},
    watch: { 
        trigger: function() {
            this.submitForm();
        },
        '$route': 'loadData',
        initData: function() {
            this.loadData();
        },
    },
    created() {
        this.loadData();
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() { // load existing data into the form
            if (this.initData) {
                if (this.initData.description) this.description.val = this.initData.description;
                if (this.initData.building_details) this.building_details.val = this.initData.building_details;
                if (this.initData.network_details) this.network_details.val = this.initData.network_details;
                if (this.initData.region) this.region.val = this.initData.region;
                if (this.initData.country) this.country.val = this.initData.country;
                if (this.initData.administrative_area) this.administrative_area.val = this.initData.administrative_area;
                if (this.initData.city) this.city.val = this.initData.city;
                if (this.initData.street_address) this.street_address.val = this.initData.street_address;
                if (this.initData.postal_code) this.postal_code.val = this.initData.postal_code;
            }
        },
        validateInputs() { // validate inputs of the fields
            var dataValid = true;
            if(this.description.val == '') {
                this.description.isValid = false;
            }
            if(this.building_details.val == '') {
                this.building_details.isValid = false;
            }
            if(this.network_details.val == '') {
                this.network_details.isValid = false;
            }
            if(this.region.val == '') {
                this.region.isValid = false;
            }
            if(this.country.val == '') {
                this.country.isValid = false;
            }
            if(this.administrative_area.val == '') {
                this.administrative_area.isValid = false;
            }
            if(this.city.val == '') {
                this.city.isValid = false;
            }
            if(this.street_address.val == '') {
                this.street_address.isValid = false;
            }
            if(this.postal_code.val == '') {
                this.postal_code.isValid = false;
            }

            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // submits formdata to the parent form
            if(this.validateInputs()) {
                const ret = {};
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.building_details.isValid) ret['building_details'] = this.building_details.val;
                if (this.network_details.isValid) ret['network_details'] = this.network_details.val;
                if (this.region.isValid) ret['region'] = this.region.val;
                if (this.country.isValid) ret['country'] = this.country.val;
                if (this.administrative_area.isValid) ret['administrative_area'] = this.administrative_area.val;
                if (this.city.isValid) ret['city'] = this.city.val;
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.street_address.isValid) ret['street_address'] = this.street_address.val;
                if (this.postal_code.isValid) ret['postal_code'] = this.postal_code.val;
                this.$emit("provide-civiclocation", {
                    ret: ret,
                    index: this.id
                });                               
            } else {
                this.$emit("form-invalid");
            }
        }
    }	
}
</script>

<style lang="scss" scoped>
    .p-inputtext.p-error {
        border-color: #f44336;
    }

    .major-card {
        border-color: #979A9D;
        border-style: solid;
    }
</style>