<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5 v-if="!noId">{{'GPS ' + id}}</h5>

            <div class="p-field">
                <label for="latitude">Latitude</label>
                <InputText id="latitude" v-model.trim="latitude.val"
                @blur="clearValidity('latitude')" aria-describedby="latitude-help" v-tooltip.left="'Input field for the latitude of the gps location.'"/>
                <small v-if="!latitude.isValid && latitude.required" id="latitude-help" class="p-error">Please input the latitude of the gps location!</small>
            </div>

            <div class="p-field">
                <label for="longitude">Longitude</label>
                <InputText id="longitude" v-model.trim="longitude.val"
                @blur="clearValidity('longitude')" aria-describedby="longitude-help" v-tooltip.left="'Input field for the longitude of the gps location.'"/>
                <small v-if="!longitude.isValid && longitude.required" id="longitude-help" class="p-error">Please input the longitude of the gps location!</small>
            </div>

            <div class="p-field">
                <label for="precision">Precision</label>
                <InputText id="precision" v-model.trim="precision.val"
                @blur="clearValidity('precision')" aria-describedby="precision-help" v-tooltip.left="'Input field for the precision of the gps location.'"/>
                <small v-if="!precision.isValid && precision.required" id="precision-help" class="p-error">Please input the precision of the gps location!</small>
            </div>
            
        </div>
    </form>
</template>

<script>
export default {
    emits: ["provide-gps", "form-invalid"],
    props: ["edit", "trigger", "id", "noId", "initData"],
	data() {
		return {
            latitude: {
                val: '',
                isValid: true,
                required: false
            },
            longitude: {
                val: '',
                isValid: true,
                required: false
            },
            precision: {
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
        loadData() { // loading data into form
            if (this.initData) {
                if (this.initData.latitude) this.latitude.val = this.initData.latitude;
                if (this.initData.longitude) this.longitude.val = this.initData.longitude;
                if (this.initData.precision) this.precision.val = this.initData.precision;
            }
        },
        validateInputs() { // validate inputs
            var dataValid = true;
            if(this.latitude.val == '') {
                this.latitude.isValid = false;
            }
            if(this.longitude.val == '') {
                this.longitude.isValid = false;
            }
            if(this.precision.val == '') {
                this.precision.isValid = false;
            }

            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        submitForm(){ // submitting data
            if(this.validateInputs()) {
                const ret = {};
                if (this.latitude.isValid) ret['latitude'] = this.latitude.val;
                if (this.longitude.isValid) ret['longitude'] = this.longitude.val;
                if (this.precision.isValid) ret['precision'] = this.precision.val;
                this.$emit("provide-gps", {
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