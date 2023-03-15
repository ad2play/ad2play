import digitalTwins from '../digitalTwinMock/digitalTwin.json';

export class TwinService {

    // get method that returns the content of the twins' JSON file to allow the frontend to see the twins structure
    public async list(): Promise<typeof digitalTwins> {
        return digitalTwins;
    }
}

export const twinService = new TwinService();