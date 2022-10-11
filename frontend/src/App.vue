// Central VUE file for setting up the frame of the webapp
<template>
    <Toast />
	<div :class="containerClass" @click="onWrapperClick">
		<AppTopBar @menu-toggle="onMenuToggle" />

        <transition name="layout-sidebar">
            <div class="layout-sidebar layout-sidebar-dark" @click="onSidebarClick" v-show="isSidebarVisible()">
                <div class="layout-logo">
                    <router-link to="/">
                    <!-- university logo ifs -->
                        <img alt="Logo" src="/assets/layout/images/ur-ifs-logo.png" />
                        <!-- <img alt="Logo" src="/assets/layout/images/logo.svg" /> -->
                    </router-link>
                </div>

                <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
            </div>
        </transition>

		<div class="layout-main">
			<router-view />
		</div>

		<AppFooter />
	</div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppFooter from './AppFooter.vue';


export default {
    data() {
        return {
            staticMenuInactive: false,
            mobileMenuActive: false,
            menu : [ // navigation menu
                {label: 'All Tasks', icon: 'pi pi-fw pi-folder-open', to: "/task/overview"},
                {label: 'Open Tasks', icon: 'pi pi-fw pi-forward', to: "/task/open"},
                {label: 'Pattern', icon: 'pi pi-fw pi-clone', to: "/pattern/list"},                
                {label: 'Source', icon: 'pi pi-fw pi-folder', to: "/helper/source"},                
                {label: 'Twin', icon: 'pi pi-fw pi-images', to: "/helper/twin"},
                {label: 'CSAF Inserter', icon: 'pi pi-fw pi-cloud-upload', to: "/helper/csafinserter"}
            ]
        }
    },
    created() {
    },
    mounted() {        
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },
    methods: {  // methods for handling the behaviour of the navmenu      
        onWrapperClick() {
            if (!this.menuClick) {
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                this.staticMenuInactive = !this.staticMenuInactive;
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.mobileMenuActive = false;
            }
        },
        isDesktop() {
            return window.innerWidth > 1024;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                return !this.staticMenuInactive;
            }
            else {
                return true;
            }
        },
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-static': 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive,
                'layout-mobile-sidebar-active': this.mobileMenuActive
            }];
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            document.body.classList.add('body-overflow-hidden');
        else
            document.body.classList.remove('body-overflow-hidden');
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppMenu': AppMenu,
        'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';

.username {
    color: white;
    margin: 10px auto 20px;
    display: block;
    text-align: center;
}
</style>
