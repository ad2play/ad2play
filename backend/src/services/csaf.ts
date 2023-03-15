import { NotFoundError } from 'restify-errors';
import { taskService } from './task';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CSAF = require('../models/mongoose/csaf');

export class CSAFService {

    // get method that returns all CSAF documents of the database
    public async list(): Promise<typeof CSAF[]> {
        return await CSAF.find({});
    }

    // create method to save a CSAF document to the database
    public async create(csaf: typeof CSAF): Promise<typeof CSAF> {
        return await new CSAF(csaf).save();
    }

    // separate method to be able to create a csaf document and task at the same time
    public async createPlusTask(csaf: typeof CSAF, entityTags: string[], groupTags: string[]): Promise<typeof CSAF> {
        const file = new CSAF(csaf);

        await file.save();

        return await taskService.create({
            type: 'Playbook Generation',
            description: 'Generate Playbook based upon the sourced advisory data in form of the linked csaf file(s)',
            manual_action_required: false,
            done: false,
            approved: false,
            csaf_files: [file._id],
            entity_tags: entityTags,
            group_tags: groupTags
        });
    }

    // put method to alter an existing document
    public async update(csaf: typeof CSAF): Promise<typeof CSAF> {
        const updateCsaf = await CSAF.findOne({ _id: csaf._id });

        if (updateCsaf) {
            await CSAF.findByIdAndUpdate({ _id: csaf._id }, csaf);
            return csaf;
        } else {
            throw new NotFoundError();
        }
    }

    // delete method 
    public async delete(id: string): Promise<void> {
        const csaf = await CSAF.findOne({ _id: id });

        if (csaf) {
            await CSAF.deleteOne({ _id: id });
        } else {
            //404
            throw new NotFoundError();
        }
    }

    // get method that returns a specific document by id
    public async getByID(id: string): Promise<typeof CSAF> {
        return await CSAF.findOne({ _id: id });
    }
}

export const csafService = new CSAFService();