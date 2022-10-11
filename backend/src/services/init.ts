import { sourceService } from './source';
import patternData from '../initPatterns/PatternData.json';
import { patternService } from './pattern';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Source = require('../models/mongoose/source');

// service for initializing the environment of the system 
export class InitService {

    // method that genereates the required source objects used in the data acquisition process
    public async init(): Promise<void> {
        console.log('Init Sources');
        const date100daysago = new Date(new Date().getTime() - (100 * 24 * 3600000));

        const names = ['NVD', 'IBM XFE', 'Cisco', 'CISA', 'Siemens'];
        const urls = ['https://nvd.nist.gov/', 'https://exchange.xforce.ibmcloud.com/', 'https://tools.cisco.com/security/center/publicationListing.x', 'https://www.cisa.gov/uscert/ics/advisories', 'https://new.siemens.com/global/en/products/services/cert.html#SecurityPublications'];
        const last_fetches = [date100daysago, date100daysago, date100daysago, date100daysago, date100daysago];

        for (const name of names) {
            const idx = names.indexOf(name);
            if (await sourceService.getByName(name)) {
                continue;
            } else {
                await sourceService.create(
                    new Source(
                        {
                            name: name,
                            url: urls[idx],
                            last_fetch: last_fetches[idx]
                        }
                    )
                )
            }
        }

        await this.initPatterns();
    }

    // method that creates the initial patterns if they are not existing at the systems startup
    public async initPatterns(): Promise<void> {
        const patterns = patternData;
        console.log(patterns)

        const existingPatterns = await patternService.list();
        console.log(existingPatterns)

        for (const initPat of patterns) {
            if (!(existingPatterns.some(el => el.name === initPat.name))) {
                await patternService.create(initPat);
                console.log(initPat.name)
            }
        }

    }

    // method that manipulates the dates of the last fetching actions for debugging purposes
    public async resetFetchDates(nbrDays: number): Promise<void> {
        console.log('Init Sources');
        const date100daysago = new Date(new Date().getTime() - (nbrDays * 24 * 3600000));

        const names = ['NVD', 'IBM XFE', 'Cisco', 'CISA', 'Siemens'];

        for (const name of names) {
            const src = await sourceService.getByName(name);
            if (src) {
                src.last_fetch = date100daysago;
                await sourceService.update(src);
            }
        }
    }
}

export const initService = new InitService();