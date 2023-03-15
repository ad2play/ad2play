// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuidv5');

export class UUIDv5 {

    // method that allows the creation of UUIDv5 identifier for the CACAO standard compliance
    public async getUUID(text: string, type: string): Promise<string> {
        const privns = uuid('null', 'aa7caf3a-d55a-4e9a-b34e-056215fba56a', true); // namespace from CACAO specification
        const privUUID = uuid(privns, text);
        return type + '--' + privUUID;
    }
}

export const uuidv5 = new UUIDv5();