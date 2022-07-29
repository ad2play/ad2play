import { PlaybookController } from './playbook';
import { HealthController } from './health';
import { CSAFController } from './csaf';
import { SourceController } from './source';
import { TaskController } from './task';
import { PatternController } from './pattern';
import { TwinController } from './twin';

// here all controllers are registered
export const CONTROLLERS = [
    new HealthController(),
    new PlaybookController(),
    new CSAFController(),
    new SourceController(),
    new TaskController(),
    new PatternController(),
    new TwinController()
];
