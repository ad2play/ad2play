import { cisaAdapter } from '../adapter/cisa';
import { ciscoAdapter } from '../adapter/cisco';
import { filter } from '../adapter/filter';
import { ibmxfeAdapter } from '../adapter/ibmxfe';
import { nvdAdapter } from '../adapter/nvd';
import { siemensAdapter } from '../adapter/siemens';
import { sourceService } from './source';
import { twinService } from './twin';

// interface for creating an object that includes all information used for identifiying the twins
export interface TwinSearch {
    twin_id: string;
    manufacturer: string;
    matching_terms: [string];
    entity_tags: [string];
    group_tags: [string];
}

// service for acquiring the relevant security advisories
export class DataAcquisitionService {

    // method for retrieving the twins' data to be used for filtering the acquired data later on
    public async getTwinData(): Promise<TwinSearch[]> {
        const ret = [];
        const digitalTwin = await twinService.list();
        for (const twin of digitalTwin) {
            let terms = [];
            for (const cpe of twin.attributes.security.cpe) {
                if (cpe.device) terms.push(cpe.device);
                if (cpe.firmware) terms.push(cpe.firmware);
            }
            terms = terms.concat(twin.attributes.security.match_tags);

            ret.push({
                twin_id: twin.thingId,
                manufacturer: twin.attributes.manufacturerName,
                matching_terms: terms,
                entity_tags: twin.attributes.security.entity_tags,
                group_tags: twin.attributes.security.group_tags
            })
        }
        return ret;
    }

    // method that fetches each source and creates the required documents for further processing
    public async fetchData(): Promise<void> {
        console.log('fetch data sources');
        const twins = await this.getTwinData();

        // Connection NVD (National Vulernerability Database) ----------------------------------------------------------------------------------------------------------
        const src_nvd = await sourceService.getByName('NVD'); // get source element
        const nvd_res_unfiltered = await nvdAdapter.getCVEsByMatch('', true, twins, new Date(src_nvd.last_fetch)); // fetch data
        const nvd_res = await filter.filterData(nvd_res_unfiltered, twins); // filter data
        src_nvd.last_fetch = new Date();
        await sourceService.update(src_nvd); // save timestamp of the fetching action in the source element
        if (nvd_res) console.log(nvd_res[0].length);
        nvdAdapter.transformIntoCSAF(nvd_res); // create the CSAF documents for the found advisories


        // Connection IBM X-Force Exchange -----------------------------------------------------------------------------------------------------------------------------
        const src_ibm = await sourceService.getByName('IBM XFE'); // get source element
        const ibm_res_unfiltered = await ibmxfeAdapter.getVulnByMatch(twins, new Date(src_ibm.last_fetch)); // fetch data
        const ibm_res = await filter.filterData(ibm_res_unfiltered, twins); // filter data
        src_ibm.last_fetch = new Date();
        await sourceService.update(src_ibm); // save timestamp of the fetching action in the source element
        if (ibm_res) console.log(ibm_res[0].length);
        ibmxfeAdapter.transformIntoCSAF(ibm_res); // create the CSAF documents for the found advisories


        // Connection CISCO OpenVul PSIRT API --------------------------------------------------------------------------------------------------------------------------
        const src_cisco = await sourceService.getByName('Cisco'); // get source element
        const cisco_res_unfiltered = await ciscoAdapter.getAllAdvFromTo(new Date(src_cisco.last_fetch)); // fetch data
        src_cisco.last_fetch = new Date();
        await sourceService.update(src_cisco); // save timestamp of the fetching action in the source element
        const cisco_res_filtered = await filter.filterData(JSON.parse(JSON.stringify(cisco_res_unfiltered)), twins); // filter data
        if (cisco_res_filtered) console.log(cisco_res_filtered[0].length);
        await ciscoAdapter.createCSAF(cisco_res_filtered); // create the CSAF documents for the found advisories


        // Connection CISA ICS CERT ------------------------------------------------------------------------------------------------------------------------------------
        const src_cisa = await sourceService.getByName('CISA'); // get source element
        const cisa_res_unfiltered = await cisaAdapter.getMatchingAdv(twins); // fetch data
        const cisa_res_filtered = await cisaAdapter.filterMatchingAdv(cisa_res_unfiltered, twins, new Date(src_cisa.last_fetch)); // filter data
        if (cisa_res_filtered) console.log(cisa_res_filtered.length);
        src_cisa.last_fetch = new Date();
        await sourceService.update(src_cisa); // save timestamp of the fetching action in the source element
        await cisaAdapter.transformIntoCSAF(cisa_res_filtered); // create the CSAF documents for the found advisories


        // Connection Siemens ProductCERT ATOM Feed --------------------------------------------------------------------------------------------------------------------------
        const src_siemens = await sourceService.getByName('Siemens'); // get source element
        const siemens_res_unfiltered = await siemensAdapter.getAllAdvFromTo(new Date(src_siemens.last_fetch)); // fetch data
        src_siemens.last_fetch = new Date();
        await sourceService.update(src_siemens); // save timestamp of the fetching action in the source element
        const siemens_res_filtered = await filter.filterData(JSON.parse(JSON.stringify(siemens_res_unfiltered)), twins); // filter data
        if (siemens_res_filtered) console.log(siemens_res_filtered[0].length);
        await siemensAdapter.createCSAF(siemens_res_filtered); // create the CSAF documents for the found advisories

    }
}

export const dataAcquisitionService = new DataAcquisitionService();