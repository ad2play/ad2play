import { NotFoundError } from 'restify-errors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Playbook = require('../models/mongoose/playbook');

export class PlaybookService {

    // get method that returns every playbook document of the database
    public async list(): Promise<typeof Playbook[]> {
        return await Playbook.find({});
    }

    // create method for saving playbook dosuments to the database
    public async create(playbook: typeof Playbook): Promise<typeof Playbook> {
        return await new Playbook(playbook).save();
    }

    // put method to alter an existing playbook document
    public async update(playbook: typeof Playbook): Promise<typeof Playbook> {
        const updatePlaybook = await Playbook.findOne({ _id: playbook._id });

        if (updatePlaybook) {
            await Playbook.findByIdAndUpdate({ _id: playbook._id }, playbook);
            return playbook;
        } else {
            throw new NotFoundError();
        }
    }

    // delete method
    public async delete(id: string): Promise<void> {
        const playbook = await Playbook.findOne({ _id: id });

        if (playbook) {
            await Playbook.deleteOne({ _id: id });
        } else {
            //404
            throw new NotFoundError();
        }
    }

    // get method that returns a specific element with a given id
    public async getByID(id: string): Promise<typeof Playbook> {
        return await Playbook.findOne({ _id: id });
    }
}

export const playbookService = new PlaybookService();