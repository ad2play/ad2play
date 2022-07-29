import { NotFoundError } from 'restify-errors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Source = require('../models/mongoose/source');

export class SourceService {

    // get method that returns all source documents of the database
    public async list(): Promise<typeof Source[]> {
        return await Source.find({});
    }

    // create method that saves source documents to the database
    public async create(source: typeof Source): Promise<typeof Source> {
        return await new Source(source).save();
    }

    // update method that alters existing source documents
    public async update(source: typeof Source): Promise<typeof Source> {
        const updateSource = await Source.findOne({ _id: source._id });

        if (updateSource) {
            await Source.findByIdAndUpdate({ _id: source._id }, source);
            return source;
        } else {
            throw new NotFoundError();
        }
    }

    // delete method
    public async delete(id: string): Promise<void> {
        const source = await Source.findOne({ _id: id });

        if (source) {
            await Source.deleteOne({ _id: id });
        } else {
            //404
            throw new NotFoundError();
        }
    }

    // get method that returns a specific document by a given id
    public async getByID(id: string): Promise<typeof Source> {
        return await Source.findOne({ _id: id });
    }

    // extra halping method for getting specific documents by the name property
    public async getByName(name: string): Promise<typeof Source> {
        return await Source.findOne({ name: name });
    }
}

export const sourceService = new SourceService();