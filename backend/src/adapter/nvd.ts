/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { csafService } from "../services/csaf";
import { config } from '../config/AppConfig';
import { TwinSearch } from '../services/dataAcquisition';
import { filter } from './filter';

// adapter for accessing data from the NVD API
export class NVDAdapter {

    // method for fetching data based on a temporal interval with the usage of filtering provided by the api
    async getCVEsByMatch(cpeMatchString: string, isExactMatch: boolean, twins: TwinSearch[], startDate: Date): Promise<JSON[]> {
        console.log('*** Fetch NVD API');

        try {
            let ret = [];
            for (const twin of twins) {
                const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/1.0/`, {
                    headers: {
                        "apiKey": config.sources.nvd_api_key
                    },
                    params: {
                        "cpeMatchString": cpeMatchString,
                        "isExactMatch": isExactMatch,
                        "keyword": twin.manufacturer,
                        "resultsPerPage": 2000
                    }
                });
                ret = ret.concat(response.data.result.CVE_Items);

                // NVD does split up their responses in multiple packages which are limited to 2000 entries -> for the case that more are required the following loop is used

                const nbrresults = response.data.totalResults;
                if (response.data.totalResults > 2000) {
                    const iterations = Math.ceil((nbrresults - 2000) / 2000);
                    for (let i = 0; i < iterations; i++) {
                        const response2 = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/1.0/`, {
                            headers: {
                                "apiKey": config.sources.nvd_api_key
                            },
                            params: {
                                "cpeMatchString": cpeMatchString,
                                "isExactMatch": isExactMatch,
                                "keyword": twin.manufacturer,
                                "resultsPerPage": 2000,
                                "startIndex": (2001 + (2000 * i))
                            }
                        });

                        ret = ret.concat(response2.data.result.CVE_Items);
                    }
                }
            }
            ret = ret.filter(function (el) {
                return new Date(el.publishedDate) > startDate;
            });

            ret = await filter.deleteDuplicates(ret);
            return JSON.parse(JSON.stringify(ret));
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    // method for parsing the date string because NVD does not like the standard ISO data format 
    parseDate(dateISO: string, start: boolean): string {
        const date = dateISO.split('T')[0];
        if (start) {
            return date + 'T00:00:00:000 Z';
        } else {
            return date + 'T23:59:00:000 Z';
        }
    }

    // method for parsing the data of each entry into the CSAF format in order to save it to the database
    async transformIntoCSAF(list: any[][]): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const CSAF = require('../models/mongoose/csaf');

        if (list) {
            for (let i = 0; i < list[0].length; i++) {
                const file = new CSAF({
                    document: {
                        title: list[0][i].cve.CVE_data_meta.ID,
                        category: 'NVD CVE',
                        description: list[0][i].cve.description.description_data[0].value,
                        csaf_version: "2.0",
                        publisher: {
                            name: "NVD",
                            category: "coordinator",
                            namespace: "https://nvd.nist.gov/"
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
                            initial_release_date: new Date().toISOString(), // li.publishedDate
                            current_release_date: new Date().toISOString(), // li.lastModifiedDate
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
                                url: `https://nvd.nist.gov/vuln/detail/${list[0][i].cve.CVE_data_meta.ID}`,
                                summary: 'origin'
                            }
                        ]
                    },
                    vulnerabilities: [
                        {
                            title: list[0][i].cve.CVE_data_meta.ID,
                            cve: list[0][i].cve.CVE_data_meta.ID,
                        }
                    ]
                });

                const refs = [];
                for (const ref of list[0][i].cve.references.reference_data) {
                    refs.push(
                        {
                            category: 'external',
                            url: ref.url,
                            summary: ref.tags.toString() + '.'
                        }
                    )
                }
                file.vulnerabilities[0].references = refs;

                type Scores = {
                    cvss_v3?: unknown,
                    cvss_v2?: unknown
                }

                const scores: Scores = {};
                if (list[0][i].impact) {
                    if (list[0][i].impact.baseMetricV3) {
                        scores.cvss_v3 = {
                            version: list[0][i].impact.baseMetricV3.cvssV3.version,
                            baseScore: list[0][i].impact.baseMetricV3.cvssV3.baseScore,
                            vectorString: list[0][i].impact.baseMetricV3.cvssV3.vectorString,
                            baseSeverity: list[0][i].impact.baseMetricV3.cvssV3.baseSeverity
                        }
                    }

                    if (list[0][i].impact.baseMetricV2) {
                        scores.cvss_v2 = {
                            version: list[0][i].impact.baseMetricV2.cvssV2.version,
                            baseScore: list[0][i].impact.baseMetricV2.cvssV2.baseScore,
                            vectorString: list[0][i].impact.baseMetricV2.cvssV2.vectorString,
                            baseSeverity: list[0][i].impact.baseMetricV2.cvssV2.baseSeverity
                        }
                    }
                }
                file.vulnerabilities[0].scores = [scores];

                // creates the CSAF document with the corresponding task
                await csafService.createPlusTask(file, list[1][i].entity_tags, list[1][i].group_tags);
            }
        }

    }
}

export const nvdAdapter = new NVDAdapter();