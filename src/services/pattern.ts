import { NotFoundError } from 'restify-errors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pattern = require('../models/mongoose/pattern');

export class PatternService {

    // get method that returns all pattern documents of the database
    public async list(): Promise<typeof Pattern[]> {
        return await Pattern.find({});
    }

    // create method to save pattern documents to the database
    public async create(pattern: typeof Pattern): Promise<typeof Pattern> {
        return await new Pattern(pattern).save();
    }

    // put method to alter an existing document
    public async update(pattern: typeof Pattern): Promise<typeof Pattern> {
        const updatePattern = await Pattern.findOne({ _id: pattern._id });

        if (updatePattern) {
            await Pattern.findByIdAndUpdate({ _id: pattern._id }, pattern);
            return pattern;
        } else {
            throw new NotFoundError();
        }
    }

    // delete method
    public async delete(id: string): Promise<void> {
        const pattern = await Pattern.findOne({ _id: id });

        if (pattern) {
            await Pattern.deleteOne({ _id: id });
        } else {
            //404
            throw new NotFoundError();
        }
    }

    // get method to find a specific document by a given id
    public async getByID(id: string): Promise<typeof Pattern> {
        return await Pattern.findOne({ _id: id });
    }
}

export const patternService = new PatternService();