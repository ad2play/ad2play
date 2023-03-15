/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import xml2js from 'xml2js';
import { csafService } from "../services/csaf";

// adapter for fetching data from the Siemens ProductCERT 
export class SiemensAdapter {

    // method for retrieving all advisory data in the given temporaal interval
    async getAllAdvFromTo(startDate: Date): Promise<any[]> {
        console.log('*** Fetch Siemens ProductCERT RSS feed');

        try {
            const response = await axios.get(`https://cert-portal.siemens.com/productcert/rss/advisories.atom`);
            const parser = new xml2js.Parser();
            const res = await parser.parseStringPromise(response.data.toString());

            const ret = [];
            for (const entry of res.feed.entry) {
                if (new Date(entry.updated) > startDate) {
                    ret.push(entry);
                }
            }
            return await this.getCSAFData(ret);

        } catch (err) {
            console.log(err);
            return null;
        }
    }

    // method for getting the CSAF JSON document from the dedicated link -> no transformation needed since it is already in the CSAF format
    async getCSAFData(array: any[]): Promise<any[]> {

        const csafData = [];
        for (const item of array) {
            const splittedLink = item.id[0].split('/');
            const advId = splittedLink[splittedLink.length - 1].split('.')[0];
            const csaf = await axios.get(`https://cert-portal.siemens.com/productcert/csaf/${advId}.json`)
                .catch(function () {
                    return null;
                });
            if (csaf) csafData.push(csaf.data);
        }
        return csafData;
    }

    // method for saving the data to the database
    async createCSAF(list: any[][]): Promise<void> {
        try {
            if (list) {
                for (let i = 0; i < list[0].length; i++) {
                    const tmp = JSON.parse(JSON.stringify(list[1][i]));
                    await csafService.createPlusTask(list[0][i], tmp.entity_tags, tmp.group_tags);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export const siemensAdapter = new SiemensAdapter();