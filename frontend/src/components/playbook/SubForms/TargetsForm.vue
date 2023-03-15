// form component for the target objects of the playbook
// one of the more complex forms because it consists of multiple sublayers

<template>       
    <form @submit.prevent="submitForm">
        <div class="card p-fluid major-card">
            <h5 v-if="!noId">{{'Tar ' + id}}</h5>

            <div class="p-field" v-if="!noId">
                <label for="key">KEY*</label>
                <p>{{key}}</p>
            </div>

            <div class="p-field">
                <label for="type">Type*</label>
                <Dropdown id="type" :options="targetTypes" placeholder="Choose Type" @change="resetForm"
                :class="{'p-error': !type.isValid}"
                v-model="type.val" @blur="clearValidity('type')" aria-describedby="type-help" 
                v-tooltip.left="'Please choose the type of the target.'"/>
                <small v-if="!type.isValid && type.required" id="type-help" class="p-error">Please choose a type!</small>
            </div>

            <div class="p-field">
                <label for="name">Name*</label>
                <InputText id="name" :class="{'p-error': !name.isValid}" v-model.trim="name.val"
                @blur="clearValidity('name')" aria-describedby="name-help" v-tooltip.left="'Input field for the name of the target.'"/>
                <small v-if="!name.isValid && name.required" 
                id="name-help" class="p-error">Please input the name of the target!</small>
            </div>

            <div class="p-field">
                <label for="description">Description</label>
                <InputText id="description" v-model.trim="description.val"
                @blur="clearValidity('description')" aria-describedby="description-help" v-tooltip.left="'Input field for the description of the target.'"/>
                <small v-if="!description.isValid && description.required" 
                id="description-help" class="p-error">Please input the description of the variable!</small>
            </div>

            <div v-if="['location'].includes(type.val)">
                <div class="p-field">
                    <label for="logical">Logical</label>
                    <InputText id="logical" v-model.trim="logical.val"
                    @blur="clearValidity('logical')" aria-describedby="logical-help" v-tooltip.left="'Input field for comma separated logical names.'"/>
                    <small v-if="!logical.isValid && logical.required" id="logical-help" class="p-error">Please input the logical names as comma separated values!</small>
                </div>
            </div>

            <div v-if="['http-api'].includes(type.val)">
                <div class="p-field">
                    <label for="http_url">HTTP URL</label>
                    <InputText id="http_url" v-model.trim="http_url.val"
                    @blur="clearValidity('http_url')" aria-describedby="http_url-help" v-tooltip.left="'Input field for the http_url of the target.'"/>
                    <small v-if="!http_url.isValid && http_url.required" 
                    id="http_url-help" class="p-error">Please input the http_url of the variable!</small>
                </div>
            </div>

            <div v-if="['http-api'].includes(type.val)">
                <div class="p-field">
                    <label for="http_auth_type">HTTP AUTH type</label>
                    <InputText id="http_auth_type" v-model.trim="http_auth_type.val"
                    @blur="clearValidity('http_auth_type')" aria-describedby="http_auth_type-help" v-tooltip.left="'Input field for the http_auth_type of the target.'"/>
                    <small v-if="!http_auth_type.isValid && http_auth_type.required" 
                    id="http_auth_type-help" class="p-error">Please input the http_auth_type of the variable!</small>
                </div>
            </div>

            <div v-if="['http-api'].includes(type.val)">
                <div class="p-field">
                    <label for="user_id">User ID</label>
                    <InputText id="user_id" v-model.trim="user_id.val"
                    @blur="clearValidity('user_id')" aria-describedby="user_id-help" v-tooltip.left="'Input field for the user_id of the target.'"/>
                    <small v-if="!user_id.isValid && user_id.required" 
                    id="user_id-help" class="p-error">Please input the user_id of the variable!</small>
                </div>
            </div>

            <div v-if="['ssh', 'net-address', 'attack-agent', 'kali'].includes(type.val)">
                <div class="p-field">
                    <label for="address">Address</label>
                    <InputText id="address" v-model.trim="address.val"
                    @blur="clearValidity('address')" aria-describedby="address-help" v-tooltip.left="'Input field for the address of the target.'"/>
                    <small v-if="!address.isValid && address.required" 
                    id="address-help" class="p-error">Please input the address of the variable!</small>
                </div>
            </div>

            <div v-if="['ssh', 'kali'].includes(type.val)">
                <div class="p-field">
                    <label for="port">Port</label>
                    <InputText id="port" v-model.trim="port.val"
                    @blur="clearValidity('port')" aria-describedby="port-help" v-tooltip.left="'Input field for the port of the target.'"/>
                    <small v-if="!port.isValid && port.required" 
                    id="port-help" class="p-error">Please input the port of the variable!</small>
                </div>
            </div>

            <div v-if="['ssh', 'net-address', 'kali'].includes(type.val)">
                <div class="p-field">
                    <label for="username">Username</label>
                    <InputText id="username" v-model.trim="username.val"
                    @blur="clearValidity('username')" aria-describedby="username-help" v-tooltip.left="'Input field for the username of the target.'"/>
                    <small v-if="!username.isValid && username.required" 
                    id="username-help" class="p-error">Please input the username of the variable!</small>
                </div>
            </div>

            <div v-if="['http-api', 'ssh', 'net-address', 'kali'].includes(type.val)">
                <div class="p-field">
                    <label for="password">Password</label>
                    <InputText id="password" v-model.trim="password.val"
                    @blur="clearValidity('password')" aria-describedby="password-help" v-tooltip.left="'Input field for the password of the target.'"/>
                    <small v-if="!password.isValid && password.required" 
                    id="password-help" class="p-error">Please input the password of the variable!</small>
                </div>
            </div>

            <div v-if="['ssh', 'net-address', 'kali'].includes(type.val)">
                <div class="p-field">
                    <label for="private_key">Private key</label>
                    <InputText id="private_key" v-model.trim="private_key.val"
                    @blur="clearValidity('private_key')" aria-describedby="private_key-help" v-tooltip.left="'Input field for the private_key of the target.'"/>
                    <small v-if="!private_key.isValid && private_key.required" 
                    id="private_key-help" class="p-error">Please input the private_key of the variable!</small>
                </div>
            </div>

            <div v-if="['http-api'].includes(type.val)">
                <div class="p-field">
                    <label for="token">Token</label>
                    <InputText id="token" v-model.trim="token.val"
                    @blur="clearValidity('token')" aria-describedby="token-help" v-tooltip.left="'Input field for the token of the target.'"/>
                    <small v-if="!token.isValid && token.required" 
                    id="token-help" class="p-error">Please input the token of the variable!</small>
                </div>
            </div>

            <div v-if="['http-api'].includes(type.val)">
                <div class="p-field">
                    <label for="oauth_header">OAUTH header</label>
                    <InputText id="oauth_header" v-model.trim="oauth_header.val"
                    @blur="clearValidity('oauth_header')" aria-describedby="oauth_header-help" v-tooltip.left="'Input field for the oauth_header of the target.'"/>
                    <small v-if="!oauth_header.isValid && oauth_header.required" 
                    id="oauth_header-help" class="p-error">Please input the oauth_header of the variable!</small>
                </div>
            </div>

            <div v-if="['security-infrastructure-category', 'net-address'].includes(type.val)">
                <div class="p-field">
                    <label for="category">Category</label>
                    <MultiSelect  id="category" :options="securityInfrastuctureType" v-model="category.val"
                    @blur="clearValidity('category')" aria-describedby="category-help" v-tooltip.left="'Selection field for categories of security-infrastructure.'"
                    placeholder="Choose categories of security-infrastructure"/>
                    <small v-if="!category.isValid && category.required" 
                    id="category-help" class="p-error">Please select the categories of security-infrastructure!</small>
                </div>
            </div>

            <div v-if="['attacker'].includes(type.val)">
                <div class="p-field">
                    <label for="executor_type">Executor Type</label>
                    <Dropdown id="executor_type" :options="orchestrationSystemType" placeholder="Choose executor_type" 
                    :class="{'p-error': !executor_type.isValid}"
                    v-model="executor_type.val" @blur="clearValidity('executor_type')" aria-describedby="executor_type-help" 
                    v-tooltip.left="'Please choose the executor_type of the target.'"/>
                    <small v-if="!executor_type.isValid && executor_type.required" id="executor_type-help" class="p-error">Please choose a executor_type!</small>
                </div>
            </div>

            <div v-if="['attack-agent'].includes(type.val)">
                <div class="p-field">
                    <label for="agent_type">Agent Type</label>
                    <Dropdown id="agent_type" :options="orchestrationSystemType" placeholder="Choose agent_type" 
                    :class="{'p-error': !agent_type.isValid}"
                    v-model="agent_type.val" @blur="clearValidity('agent_type')" aria-describedby="agent_type-help" 
                    v-tooltip.left="'Please choose the agent_type of the target.'"/>
                    <small v-if="!agent_type.isValid && agent_type.required" id="agent_type-help" class="p-error">Please choose a agent_type!</small>
                </div>
            </div>

            <!-- form recursively calls itself -->
            <div class="card p-fluid" v-if="['attacker'].includes(type.val)">
                <div>
                    <h4>Executor</h4>
                    <div v-for="index in executorCounter" :key="index">
                        <TargetsForm @provide-target="setExecutor" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :noId="true" :initData="getInitData(initExecutor, index)"></TargetsForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="executorCounter += 1" v-if="executorCounter === 0">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="executorCounter -= 1" v-if="executorCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <!-- form recursively calls itself -->
            <div class="card p-fluid" v-if="['attacker'].includes(type.val)">
                <div>
                    <h4>Subject</h4>
                    <div v-for="index in subjectCounter" :key="index">
                        <TargetsForm @provide-target="setSubject" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :noId="true" :initData="getInitData(initSubject, index)"></TargetsForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="subjectCounter += 1" v-if="subjectCounter === 0">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="subjectCounter -= 1" v-if="subjectCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <div class="card p-fluid" v-if="['individual', 'group', 'organization'].includes(type.val)">
                <div>
                    <h4>Target Extensions</h4>
                    <div v-for="index in extensionsCounter" :key="index">
                        <ExtensionsForm @provide-extension="setExtensions" @form-invalid="emitInvalidity" :trigger="trigger" :id="index" :initData="getInitData(initExtensiondata, index)"></ExtensionsForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="extensionsCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="extensionsCounter -= 1" v-if="extensionsCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>
            
            <div v-if="['individual', 'group', 'organization'].includes(type.val)">
                <h4>Contact</h4>
                <ContactForm @provide-contact="setContactData" @form-invalid="emitInvalidity" :trigger="trigger" :noId="true" :id="null" :initData="initcontact"></ContactForm>
            </div>

            <div v-if="['individual', 'group', 'organization', 'location', 'net-address'].includes(type.val)">
                <h4>Civic Location</h4>
                <CivicLocationForm @provide-civiclocation="setCivicLocationData" @form-invalid="emitInvalidity" :trigger="trigger" :noId="true" :id="null" :initData="initLocation"></CivicLocationForm>
            </div>

            <div class="card p-fluid" v-if="['sector'].includes(type.val)">
                <div>
                    <h4>Civic Locations</h4>
                    <div v-for="index in multipleCLCounter" :key="index">
                        <CivicLocationForm @provide-civiclocation="setMultipleCivicLocationData" @form-invalid="emitInvalidity" :trigger="trigger" :noId="false" :id="index" :initData="getInitData(initMultipleLocation, index)"></CivicLocationForm>
                    </div>
                    <div class="p-d-flex p-jc-between p-flex-column p-flex-sm-row">
                        <Button class="p-button-success p-mr-2 p-mb-1" @click="multipleCLCounter += 1">Add</Button>
                        <Button class="p-button-warning p-mr-2 p-mb-1" @click="multipleCLCounter -= 1" v-if="multipleCLCounter > 0">Delete Last</Button>
                    </div>
                    
                </div>
            </div>

            <div v-if="['location'].includes(type.val)">
                <h4>GPS Location</h4>
                <GPSForm @provide-gps="setGPS" @form-invalid="emitInvalidity" :trigger="trigger" :noId="true" :id="null" :initData="initGps"></GPSForm>
            </div>
            
        </div>
    </form>
</template>

<script>
import ContactForm from './ContactForm.vue';
import CivicLocationForm from './CivicLocationForm.vue';
import ExtensionsForm from './ExtensionsForm.vue';
import GPSForm from './GPSForm.vue';

export default {
    emits: ["provide-target", "form-invalid"],
    props: ["edit", "trigger", "id", "noId", "initData"],
    name: 'TargetsForm',
    components: {
        ContactForm,
        CivicLocationForm,
        ExtensionsForm,
        GPSForm
    },
	data() {
		return {
            subFormsEmitted: false,
            extensionsCounter: 0,
            extensionsEmitted: false,
            extensionsEmittedCounter: 0,
            contactFormEmitted: false,
            clformEmitted: false,
            gpsFormEmitted: false,
            executorCounter: 0,
            subjectCounter: 0,
            executorEmitted: false,
            subjectEmitted: false,
            multipleCLs: [],
            multipleCLEmitted:  false,
            multipleCLEmittedCounter: 0,
            multipleCLCounter: 0,
            targetTypes: [ // enumerations compliant to CACAO
                'individual',
                'group',
                'organization',
                'location',
                'sector',
                'http-api',
                'ssh',
                'security-infrastructure-category',
                'net-address',
                'kali',
                'attacker',
                'attack-agent',
                'attack-group'
            ],
            securityInfrastuctureType: [ // enumerations compliant to CACAO
                'endpoint',
                'handset',
                'router',
                'firewall',
                'ids',
                'ips',
                'aaa',
                'os-windows',
                'os-linux',
                'os-mac',
                'switch',
                'wireless',
                'desktop',
                'server',
                'content-gateway',
                'analytics',
                'siem',
                'tip',
                'ticketing'
            ],
            orchestrationSystemType: [ // enumerations compliant to CACAO
                'kali',
                'caldera',
                'redcanary-atomicred'
            ],
            attackAgentType: [ // enumerations compliant to CACAO
                'sandcat',
                'manx',
                'ragdoll'
            ],
            type: {
                val: '',
                isValid: true,
                required: true
            },
            name: {
                val: '',
                isValid: true,
                required: true
            },
            description: {
                val: '',
                isValid: true,
                required: false
            },
            logical: {
                val: '',
                isValid: true,
                required: false
            },
            http_url: {
                val: '',
                isValid: true,
                required: false
            },
            http_auth_type: {
                val: '',
                isValid: true,
                required: false
            },
            user_id: {
                val: '',
                isValid: true,
                required: false
            },
            password: {
                val: '',
                isValid: true,
                required: false
            },
            token: {
                val: '',
                isValid: true,
                required: false
            },
            oauth_header: {
                val: '',
                isValid: true,
                required: false
            },
            address: {
                val: '',
                isValid: true,
                required: false
            },
            port: {
                val: '',
                isValid: true,
                required: false
            },
            username: {
                val: '',
                isValid: true,
                required: false
            },
            private_key: {
                val: '',
                isValid: true,
                required: false
            },
            category: {
                val: null,
                isValid: true,
                required: false
            },
            executor: null,
            executor_type: {
                val: '',
                isValid: true,
                required: false
            },
            subject: null,
            agent_type: {
                val: '',
                isValid: true,
                required: false
            },
            contact: null,
            location: null,
            gps: null,
            extensions: [],
            // variables for initializing 
            initExtensiondata: null,
            initExecutor: null,
            initSubject: null,
            initGps: null,
            initLocation: null,
            initcontact: null,
            initMultipleLocation: []
        };
	},
    watch: {
        subFormsEmitted: function(newVal) {
            if (newVal) {
                this.submitForm();
            }
        },
        trigger: function() {
            this.checkSubEmits();
        },
        '$route': 'loadData',
        initData: function() {
            this.loadData();
        },
    },
    created() {
        this.loadData();
    },
    computed: {
        key() { // computed property that generates the uuidv5 key of the target based on its content
            const ret = {};
            
            if (this.type.isValid) ret['type'] = this.type.val;
            if (this.name.isValid) ret['name'] = this.name.val;
            if (this.description.isValid) ret['description'] = this.description.val;
            if (this.contact) if (Object.keys(this.contact).length !== 0) ret['contact'] = this.contact;
            if (this.extensions.length !== 0) ret['target_extensions'] = this.$store.getters['help/createDictionary'](this.extensions);                
            if (this.logical.isValid) ret['logical'] = this.logical.val.split(',').filter(function (el) {return el !== '';});
            if (this.gps) if (Object.keys(this.gps).length !== 0) ret['gps'] = this.gps;
            if (this.http_url.isValid) ret['http_url'] = this.http_url.val;
            if (this.http_auth_type.isValid) ret['http_auth_type'] = this.http_auth_type.val;
            if (this.user_id.isValid) ret['user_id'] = this.user_id.val;
            if (this.password.isValid) ret['password'] = this.password.val;
            if (this.token.isValid) ret['token'] = this.token.val;
            if (this.oauth_header.isValid) ret['oauth_header'] = this.oauth_header.val;
            if (this.address.isValid) ret['address'] = this.address.val;
            if (this.port.isValid) ret['port'] = this.port.val;
            if (this.username.isValid) ret['username'] = this.username.val;
            if (this.private_key.isValid) ret['private_key'] = this.private_key.val;
            if (this.category.isValid) ret['category'] = this.category.val;
            if (this.executor_type.isValid) ret['executor_type'] = this.executor_type.val;
            if (this.agent_type.isValid) ret['agent_type'] = this.agent_type.val;
            if (this.executor) ret['executor'] = this.executor;
            if (this.subject) ret['subject'] = this.subject;
            
            // location can either be an object or an array
            if (this.type.val === 'sector') { // for the sector type multiple locations can be stored
                if (this.multipleCLs.length !== 0) {
                    ret['location'] = this.multipleCLs;
                }
            } else {
                if (this.location) if (Object.keys(this.location).length !== 0) ret['location'] = this.location;
            }

            return this.$store.getters['uuid/uuidv5']('target', ret);
        }
    },
    methods: {
        loadData() { // when an existing playbook is edited this method loads the data into the fields
            if (this.initData) {
                if (this.initData.ret.type) this.type.val = this.initData.ret.type;
                if (this.initData.ret.name) this.name.val = this.initData.ret.name;
                if (this.initData.ret.description) this.description.val = this.initData.ret.description;
                if (this.initData.ret.logical) this.logical.val = this.initData.ret.logical.toString();
                if (this.initData.ret.http_url) this.http_url.val = this.initData.ret.http_url;
                if (this.initData.ret.http_auth_type) this.http_auth_type.val = this.initData.ret.http_auth_type;
                if (this.initData.ret.user_id) this.user_id.val = this.initData.ret.user_id;
                if (this.initData.ret.password) this.password.val = this.initData.ret.password;
                if (this.initData.ret.token) this.token.val = this.initData.ret.token;
                if (this.initData.ret.oauth_header) this.oauth_header.val = this.initData.ret.oauth_header;
                if (this.initData.ret.address) this.address.val = this.initData.ret.address;
                if (this.initData.ret.port) this.port.val = this.initData.ret.port;
                if (this.initData.ret.username) this.username.val = this.initData.ret.username;
                if (this.initData.ret.private_key) this.private_key.val = this.initData.ret.private_key;
                if (this.initData.ret.category) this.category.val = this.initData.ret.category;
                if (this.initData.ret.executor_type) this.executor_type.val = this.initData.ret.executor_type;
                if (this.initData.ret.agent_type) this.agent_type.val = this.initData.ret.agent_type;

                if (this.initData.ret.target_extensions) {
                    this.initExtensiondata = this.$store.getters['help/reverseDictionary'](this.initData.ret.target_extensions);
                    this.extensionsCounter = this.initExtensiondata.length;
                }

                if (this.initData.ret.executor) {
                    this.initExecutor = [{ret: this.initData.ret.executor}];
                    this.executorCounter = this.initExecutor.length;
                }

                if (this.initData.ret.subject) {
                    this.initSubject = [{ret: this.initData.ret.subject}];
                    this.subjectCounter = this.initSubject.length;      
                }

                if (this.initData.ret.gps) {
                    this.initGps = this.initData.ret.gps;
                }

                if (this.initData.ret.location) { // depending on the type of the target the location property is either an object or an array
                    if(this.initData.ret.type === 'sector') {
                        this.initMultipleLocation = this.initData.ret.location;
                        this.multipleCLCounter = this.initData.ret.location.length;
                    } else {
                        this.initLocation = this.initData.ret.location;
                    }                    
                }

                if (this.initData.ret.contact) {
                    this.initcontact = this.initData.ret.contact;
                }
            }
        },
        getInitData(data, index) {
            if (data) {
                if (data[index - 1]) {
                    return data[index - 1];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        setContactData(event) { // method that saves the data emitted by the contactdataform
            this.contact = event.ret
            
            this.contactFormEmitted = true;
            this.checkSubEmits();
        },
        setCivicLocationData(event) { // method that saves the data emitted by the civiclocationform
            this.location = event.ret
            
            this.clformEmitted = true;
            this.checkSubEmits();
        },
        setMultipleCivicLocationData(event) { // method that saves the data emitted by multiple civiclocationsform
            this.multipleCLs.push(event.ret);
            
            this.multipleCLEmittedCounter += 1;
            if (this.multipleCLEmittedCounter === this.multipleCLCounter) {
                this.multipleCLEmitted = true;
            }
            this.checkSubEmits();
        },
        setExtensions(event) { // method that saves the data emitted by the extensionsform
            this.extensions.push(event);
            
            this.extensionsEmittedCounter += 1;
            if (this.extensionsEmittedCounter === this.extensionsCounter) {
                this.extensionsEmitted = true;
            }
            this.checkSubEmits();
        },
        setGPS(event) { // method that saves the data emitted by the gpsform
            this.gps = event.ret
            console.log(this.gps)
            
            this.gpsFormEmitted = true;
            this.checkSubEmits();
        },
        setExecutor(event) { // method that saves the data emitted by the executorform(targetform)
            this.executor = event.ret
            
            this.executorEmitted = true;
            this.checkSubEmits();
        },
        setSubject(event) { // method that saves the data emitted by the subjectform(targetform)
            this.subject = event.ret
            
            this.subjectEmitted = true;
            this.checkSubEmits();
        },
        checkSubEmits() { // checks if all subforms have emitted the required data
            if (this.extensionsCounter === 0) {
                this.extensionsEmitted = true;
            }

            if (!['individual', 'group', 'organization'].includes(this.type.val)) {
                this.contactFormEmitted = true;
            }

            if (!['individual', 'group', 'organization', 'location', 'net-address'].includes(this.type.val)) {
                this.clformEmitted = true;
            }

            if (!['location'].includes(this.type.val)) {
                this.gpsFormEmitted = true;
            }

            if (!['sector'].includes(this.type.val)) {
                this.multipleCLEmitted = true;
            }

            if (this.executorCounter === 0) {
                this.executorEmitted = true;
            }

            if (this.subjectCounter === 0) {
                this.subjectEmitted = true;
            }
            
            if (this.contactFormEmitted && this.clformEmitted && this.extensionsEmitted && this.gpsFormEmitted && this.executorEmitted && this.subjectEmitted && this.multipleCLEmitted) {
                this.subFormsEmitted = true;
            }
        },
        resetForm() { // clears content of the form
            this.name.val = '';
            this.description.val = '';         
            this.logical.val = '';
            this.http_url.val = '';
            this.http_auth_type.val = '';
            this.user_id.val = '';
            this.password.val = '';
            this.token.val = '';
            this.oauth_header.val = '';
            this.address.val = '';
            this.port.val = '';
            this.username.val = '';
            this.private_key.val = '';
            this.category.val = null;
            this.executor_type.val = '';
            this.agent_type.val = '';
        },
        validateInputs() { // input validation
            var dataValid = true;
            if(this.type.val == '') {
                this.type.isValid = false;
                dataValid = false;
            }
            if(this.name.val == '') {
                this.name.isValid = false;
                dataValid = false;
            }
            if(this.description.val == '') {
                this.description.isValid = false;
            }
            if(this.logical.val == '') {
                this.logical.isValid = false;
            }
            if(this.http_url.val == '') {
                this.http_url.isValid = false;
            }
            if(this.http_auth_type.val == '') {
                this.http_auth_type.isValid = false;
            }
            if(this.user_id.val == '') {
                this.user_id.isValid = false;
            }
            if(this.password.val == '') {
                this.password.isValid = false;
            }
            if(this.token.val == '') {
                this.token.isValid = false;
            }
            if(this.oauth_header.val == '') {
                this.oauth_header.isValid = false;
            }
            if(this.address.val == '') {
                this.address.isValid = false;
            }
            if(this.port.val == '') {
                this.port.isValid = false;
            }
            if(this.username.val == '') {
                this.username.isValid = false;
            }
            if(this.private_key.val == '') {
                this.private_key.isValid = false;
            }
            if(this.category.val == null) {
                this.category.isValid = false;
            }
            if(this.executor_type.val == '') {
                this.executor_type.isValid = false;
            }
            if(this.agent_type.val == '') {
                this.agent_type.isValid = false;
            }
            
            return dataValid;
        },
        clearValidity(field) {
            this[field].isValid = true;
        },
        emitInvalidity() {
            this.$emit("form-invalid");
        },
        submitForm(){ // submitting method
            this.clformEmitted = false; // set these values to their initial state to ensure that the form is working again
            this.contactFormEmitted = false;
            this.subFormsEmitted = false;
            this.extensionsEmitted = false;
            this.extensionsEmittedCounter = 0;
            this.gpsFormEmitted = false;
            this.executorEmitted = false;
            this.subjectEmitted = false;
            this.multipleCLEmitted = false;
            this.multipleCLEmittedCounter = 0;

            if(this.validateInputs()) {
                const ret = {}; // build the return object
                if (this.type.isValid) ret['type'] = this.type.val;
                if (this.name.isValid) ret['name'] = this.name.val;
                if (this.description.isValid) ret['description'] = this.description.val;
                if (this.contact) if (Object.keys(this.contact).length !== 0) ret['contact'] = this.contact;
                if (this.location) if (Object.keys(this.location).length !== 0) ret['location'] = this.location;
                if (this.extensions.length !== 0) ret['target_extensions'] = this.$store.getters['help/createDictionary'](this.extensions);                
                if (this.logical.isValid) ret['logical'] = this.logical.val.split(',').filter(function (el) {return el !== '';});
                if (this.gps) if (Object.keys(this.gps).length !== 0) ret['gps'] = this.gps;
                if (this.http_url.isValid) ret['http_url'] = this.http_url.val;
                if (this.http_auth_type.isValid) ret['http_auth_type'] = this.http_auth_type.val;
                if (this.user_id.isValid) ret['user_id'] = this.user_id.val;
                if (this.password.isValid) ret['password'] = this.password.val;
                if (this.token.isValid) ret['token'] = this.token.val;
                if (this.oauth_header.isValid) ret['oauth_header'] = this.oauth_header.val;
                if (this.address.isValid) ret['address'] = this.address.val;
                if (this.port.isValid) ret['port'] = this.port.val;
                if (this.username.isValid) ret['username'] = this.username.val;
                if (this.private_key.isValid) ret['private_key'] = this.private_key.val;
                if (this.category.isValid) ret['category'] = this.category.val;
                if (this.executor_type.isValid) ret['executor_type'] = this.executor_type.val;
                if (this.agent_type.isValid) ret['agent_type'] = this.agent_type.val;
                if (this.executor) ret['executor'] = this.executor;
                if (this.subject) ret['subject'] = this.subject;

                if (this.type.val === 'sector') {
                    if (this.multipleCLs.length !== 0) {
                        ret['location'] = this.multipleCLs;
                    }
                } else {
                    if (this.location) if (Object.keys(this.location).length !== 0) ret['location'] = this.location;
                }

                if (!this.noId) {
                   ret['key'] = this.key; 
                }
                
                this.$emit("provide-target", { // emits the target object to the parent form
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