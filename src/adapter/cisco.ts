/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { csafService } from "../services/csaf";
import { cvrfToCsaf } from "./CVRFtoCSAF";
import { config } from '../config/AppConfig';

// adapter for fetching advisories from the CISCO source
export class CISCOAdapter {

    // acquiring access token based on the credentials in order to be able to access the rest api
    async getAccessToken(): Promise<string> {
        const requestString = `grant_type=client_credentials&client_id=${config.sources.cisco_client_id}&client_secret=${config.sources.cisco_client_secret}`

        const token = await axios.post(`https://cloudsso.cisco.com/as/token.oauth2`, requestString, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return token.data.access_token;
    }

    // method for retrieving advisories for a given time intervall
    async getAllAdvFromTo(startDate: Date): Promise<any[]> {
        console.log('*** Fetch CISCO openVuln PSIRT API');

        try {
            const token = await this.getAccessToken();
            const response = await axios.get(`https://api.cisco.com/security/advisories/all/firstpublished?`, {
                headers: {
                    "authorization": `Bearer ${token}`
                },
                params: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                }
            });
            return response.data.advisories;
        } catch (err) {
            // console.log(err);
            return null;
        }
    }

    // method that receives an 2d array with the retrieved advisories
    async createCSAF(list: any[][]): Promise<void> {
        try {
            if (list) {
                for (let i = 0; i < list[0].length; i++) {
                    const tmp = JSON.parse(JSON.stringify(list[1][i]));
                    // for each advisory the CVRF file must be accessed separately
                    await this.processCVRF(list[0][i]['cvrfUrl'], tmp.entity_tags, tmp.group_tags);
                }
            }

        } catch (err) {
            console.log(err)
        }
    }

    // method that retrieves the CVRF XML document for each advisory
    async processCVRF(url: string, entityTags: string[], groupTags: string[]): Promise<void> {
        try {
            const response = await axios.get(url);
            // CVRF to CSAF converter is outsourced to a single class
            const res = await cvrfToCsaf.convert(response.data, 'CISCO', 'https://tools.cisco.com/security/center/publicationListing.x');
            await csafService.createPlusTask(res, entityTags, groupTags);
        } catch (err) {
            console.log(err)
        }
    }
}

export const ciscoAdapter = new CISCOAdapter();