import { dataAcquisitionService } from "./services/dataAcquisition";
import { playbookService } from "./services/playbook";
import { playbookGeneratorService } from "./services/playbookGenerator";
import { taskService } from "./services/task";

// coordinating class for executing the core aspects of the playbook generation process
export class RDM {

    // method for running the data acquisition and playbook generation 
    async run(): Promise<void> {
        await dataAcquisitionService.fetchData();
        await playbookGeneratorService.scanTasks();
    }

    // method that resets all tasks to the origin -> only for debugging purposes
    async resetTasks(): Promise<void> {
        const tasks = await taskService.list()

        for (const task of tasks) {
            let pbid = ''
            if (task.playbook.length !== 0) pbid = task.playbook[0]
            const t = task;
            t.manual_action_required = false;
            t.done = false;
            t.approved = false;
            t.playbook = []

            await taskService.update(t);

            if (pbid !== '') {
                await playbookService.delete(pbid);
            }
        }
        console.log('RESET')
    }
}

export const rdm = new RDM();