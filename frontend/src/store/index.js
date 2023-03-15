import { createStore } from 'vuex';

import csafModule from './modules/csaf/index.js';
import playbookModule from './modules/playbook/index.js';
import patternModule from './modules/pattern/index.js';
import taskModule from './modules/task/index.js';
import uuidModule from './modules/uuid/index.js';
import helpModule from './modules/help/index.js';
import sourceModule from './modules/source/index.js';
import twinModule from './modules/twin/index.js';

// here all the modules are registered to build the vuex store
const store = createStore({
    modules: {
        csaf: csafModule,
        playbook: playbookModule,
        pattern: patternModule,
        task: taskModule,
        uuid: uuidModule,
        help: helpModule,
        source: sourceModule,
        twin: twinModule
    }
});

export default store;