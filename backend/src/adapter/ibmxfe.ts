/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { csafService } from "../services/csaf";
import { config } from '../config/AppConfig';
import { TwinSearch } from '../services/dataAcquisition';
import { filter } from "./filter";

// adapter for fetching data from IBM X-Force Exchange
export class IBMXFEAdapter {

    // central method for retrieving advisory data for a given temporal interval and with built in filtering based on the twins data
    async getVulnByMatch(twins: TwinSearch[], startDate: Date): Promise<any[]> {
        console.log('*** Fetch IBM X-Force Exchange API');
        const token = Buffer.from(config.sources.ibm_xfe_key + ':' + config.sources.ibm_xfe_pw).toString('base64');
        try {
            let ret = [];
            for (const twin of twins) {
                const response = await axios.get(`https://api.xforce.ibmcloud.com/vulnerabilities/fulltext?`, {
                    headers: {
                        "authorization": "Basic " + token
                    },
                    params: {
                        q: twin.manufacturer,
                        startDate: startDate.toISOString()
                    }
                });
                ret = ret.concat(response.data.rows);
            }
            ret = await filter.deleteDuplicates(ret);

            return ret;
        } catch (err) {
            // console.log(err);
            return null;
        }
    }

    // method for transforming the retrieved advisories into the CSAF format by mapping the data fields
    async transformIntoCSAF(list: any[][]): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const CSAF = require('../models/mongoose/csaf');

        if (list) {
            for (let i = 0; i < list[0].length; i++) {
                const file = new CSAF({
                    document: {
                        title: list[0][i].title,
                        category: 'IBM XFE',
                        description: list[0][i].description,
                        csaf_version: "2.0",
                        publisher: {
                            name: "IBM",
                            category: "coordinator",
                            namespace: "https://exchange.xforce.ibmcloud.com/"
                        },
                        distribution: {
                            text: "Disclosure is not limited.",
                            tlp: {
                                label: "WHITE"
                            }
                        },
                        tracking: {
                            id: list[0][i].title,
                            status: "final",
                            version: "1",
                            revision_history: [
                                {
                                    number: "1",
                                    legacy_version: "1.0",
                                    date: new Date().toISOString(),
                                    summary: "Publication Date"
                                }
                            ],
                            initial_release_date: new Date().toISOString(),
                            current_release_date: new Date().toISOString(),
                            generator: {
                                engine: {
                                    name: "LST-SOAR_Platform",
                                    version: "1"
                                }
                            }
                        },
                        references: [
                            {
                                category: 'self',
                                url: `https://exchange.xforce.ibmcloud.com/vulnerabilities/${list[0][i].xfdbid}`,
                                summary: 'origin'
                            }
                        ],
                    },
                    vulnerabilities: [
                        {
                            title: list[0][i].title,
                            cve: list[0][i].stdcode[0],
                            remediations: [
                                {
                                    category: 'undefined',
                                    details: list[0][i].remedy
                                }
                            ]
                        }
                    ]
                });

                const refs = [];
                for (const ref of list[0][i].references) {
                    refs.push(
                        {
                            category: 'external',
                            url: ref.link_target,
                            summary: ref.description
                        }
                    )
                }
                file.vulnerabilities[0].references = refs;

                type Scores = {
                    cvss_v3?: unknown,
                    cvss_v2?: unknown
                }

                const scores: Scores = {};
                if (list[0][i].cvss) {
                    if (list[0][i].cvss.version === '3.0' || list[0][i].cvss.version === '3.1') {
                        scores.cvss_v3 = {
                            version: list[0][i].cvss.version,
                            baseScore: list[0][i].risk_level
                        }
                    } else if (list[0][i].cvss.version === '2.0') {
                        scores.cvss_v2 = {
                            version: list[0][i].cvss.version,
                            baseScore: list[0][i].risk_level
                        }
                    }
                }
                file.vulnerabilities[0].scores = [scores];

                // creates the CSAF document plus the corresponding task document in the database
                csafService.createPlusTask(file, list[1][i].entity_tags, list[1][i].group_tags);
            }
        }

    }
}

export const ibmxfeAdapter = new IBMXFEAdapter();