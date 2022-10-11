import { config } from './config/AppConfig';
import 'reflect-metadata';
import { Server } from './server/index';
import { rdm } from './rdm';
import { evaluate } from './evaluation';
import { initService } from './services/init';
import * as cron from 'node-cron';

const server = new Server();

// central script that starts the whole server
try {
    server.start(+config.app.port);
    initService.init();

    cron.schedule('1 */4 * * *', () => {
        console.log('Data Acquisition and Playbook Generation runs every four hours');
        rdm.run();
    });

    if (process.env.GENERATE_EVALUATION_OUTPUT === 'true') {
        evaluate.generateEvalOutput();
    }


} catch (err) {
    console.log(err);
    throw err;
}
