import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';

// router instance that connects the different paths to the desired components to allow the navigation through the webapp

const routes = [
    {
        path: '/',
        name: 'landing',
        component: Dashboard,
    },
    {
        path: '/task/overview',
        name: 'taskoverview',
        props: true,
        component: () => import('./components/task/TaskOverview.vue'),
        meta: {
            title: "Task Overview"
        }
    },
    {
        path: '/task/open',
        name: 'opentasks',
        props: true,
        component: () => import('./components/task/OpenTasks.vue'),
        meta: {
            title: "Open Tasks"
        }
    },
    {
        path: '/task/:id',
        name: 'singletaskview',
        props: true,
        component: () => import('./components/task/TaskView.vue'),
        meta: {
            title: "Task"
        }
    },
    {
        path: '/playbook/create',
        name: 'createPlaybook',
        props: true,
        component: () => import('./components/playbook/PlaybookConfigurator.vue'),
        meta: {
            title: "Create Playbook"
        }
    },
    {
        path: '/task/:taskId/createPlaybook/',
        name: 'createPlaybookForTask',
        props: true,
        component: () => import('./components/task/TaskCreatePlaybook.vue'),
        meta: {
            title: "Create Playbook"
        }
    },
    {
        path: '/task/:taskId/editPlaybook/:id',
        name: 'editPlaybookForTask',
        props: true,
        component: () => import('./components/task/TaskEditPlaybook.vue'),
        meta: {
            title: "Edit Playbook"
        }
    },
    {
        path: '/pattern/list',
        name: 'patternlist',
        props: true,
        component: () => import('./components/pattern/PatternOverview.vue'),
        meta: {
            title: "Pattern"
        }
    },
    {
        path: '/pattern/:id',
        name: 'singlepatternview',
        props: true,
        component: () => import('./components/pattern/PatternView.vue'),
        meta: {
            title: "Pattern"
        }
    },
    {
        path: '/pattern/create',
        name: 'createPattern',
        props: true,
        component: () => import('./components/pattern/PatternCreate.vue'),
        meta: {
            title: "Create Pattern"
        }
    },
    {
        path: '/pattern/edit/:id',
        name: 'editPattern',
        props: true,
        component: () => import('./components/pattern/PatternEdit.vue'),
        meta: {
            title: "Edit Pattern"
        }
    },
    {
        path: '/helper/source',
        name: 'sourceOverview',
        props: true,
        component: () => import('./components/helper/SourceOverview.vue'),
        meta: {
            title: "Source Overview"
        }
    },
    {
        path: '/helper/twin',
        name: 'twinOverview',
        props: true,
        component: () => import('./components/helper/TwinOverview.vue'),
        meta: {
            title: "Twin Overview"
        }
    },
    {
        path: '/helper/csafinserter',
        name: 'csafInserter',
        props: true,
        component: () => import('./components/helper/CSAFInserter.vue'),
        meta: {
            title: "CSAF Inserter"
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach(async (to) => {
    document.title = "Ad2Play" + ((to.meta.title) ? " - " + to.meta.title : "");
})

export default router;
