import { NotFoundError, BadRequestError } from 'restify-errors';
import { csafService } from './csaf';
import { playbookService } from './playbook';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Task = require('../models/mongoose/task');

export class TaskService {

    // get method for getting all task documents in the database
    public async list(): Promise<typeof Task[]> {
        return await Task.find({});
    }

    // create method to save task documents to the database
    public async create(task: typeof Task): Promise<typeof Task> {
        if (task.csaf_files) { // checks if the given CSAF ids do exist in db
            for (const file of task.csaf_files) {
                if (!(await csafService.getByID(file))) {
                    throw BadRequestError;
                }
            }
        }

        if (task.playbook) { // checks of the given playbook ids do exist in db
            for (const file of task.playbook) {
                if (!(await playbookService.getByID(file))) {
                    throw BadRequestError;
                }
            }
        }

        return await new Task(task).save();
    }

    // update method for altering existing documents
    public async update(task: typeof Task): Promise<typeof Task> {
        const updateTask = await Task.findOne({ _id: task._id });

        if (updateTask) {
            await Task.findByIdAndUpdate({ _id: task._id }, task);
            return task;
        } else {
            throw new NotFoundError();
        }
    }

    // delte method
    public async delete(id: string): Promise<void> {
        const task = await Task.findOne({ _id: id });

        if (task) {
            await Task.deleteOne({ _id: id });
        } else {
            //404
            throw new NotFoundError();
        }
    }

    // get method that returns a specific document by a given id
    public async getByID(id: string): Promise<typeof Task> {
        return await Task.findOne({ _id: id });
    }

    // helping getter method that only returns tasks that are not done and don't require manual action
    public async getNotDoneAndNotManual(): Promise<typeof Task> {
        return await Task.find({ done: false, manual_action_required: false });
    }
}

export const taskService = new TaskService();