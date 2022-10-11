/* eslint-disable @typescript-eslint/no-explicit-any */
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { csafService } from '../services/csaf';
import { TwinSearch } from '../services/dataAcquisition';
import { filter } from './filter';

// List item interface for storing each CISA advisory in an dedicated object
interface ListItems {
    title: string;
    description: string;
    link: string;
    text: string;
    headline: string;
    headings: string[];
    date: Date,
    entity_tags: string[],
    group_tags: string[]
}

// CISA source adapter for fetching advisories from the ICS CERT
export class CISAAdapter {

    // method for filtering the list items of the first page of the CISA ICS CERT
    async getMatchingAdv(twins: TwinSearch[]): Promise<ListItems[]> {
        console.log('*** Scrape CISA ICS CERT site');
        let ret = [];
        for (const twin of twins) {
            let list = []

            const response = await fetch('https://www.cisa.gov/uscert/ics/advisories?items_per_page=All');
            const text = await response.text();

            const $ = cheerio.load(text);
            $('.item-list').find('li').each((i, el) => {
                const title = $(el).find('.views-field-field-ics-docid-advisory').text();
                const description = $(el).find('.views-field-title').text();
                const link = $(el).find('.views-field-title').find('a').attr('href');
                list.push({ title: title, description: description, link: link, entity_tags: [], group_tags: [] });
            });

            list = list.filter(function (el) {
                return el.description.includes(twin.manufacturer);
            });
            ret = ret.concat(list);
        }
        ret = await filter.deleteDuplicates(ret);

        return ret;
    }

    // method for filtering the individual advisories by given matching terms
    async filterMatchingAdv(unfilteredList: ListItems[], twins: TwinSearch[], startDate: Date): Promise<ListItems[]> {
        const filteredList = [];

        for (const li of unfilteredList) {
            const response = await fetch(`https://www.cisa.gov/uscert/${li.link}`);
            const text = await response.text();

            const $ = cheerio.load(text);

            const date = $('.submitted').text().trim().split('|')[0];
            li.date = new Date(date);

            if (li.date < startDate) {
                continue
            }

            const title = $('.region-content > #ncas-header > #page-title ').text().trim();
            li.headline = title;

            const content = $('#ncas-content > .field').text().trim();
            li.text = content;

            let addLi = false;
            for (const twin of twins) {
                if (twin.matching_terms.some(term => li.text.includes(term))) {
                    $('#ncas-content > .field > h2').each((i, el) => {
                        if (li.headings) {
                            li.headings.push($(el).text().toString());
                        } else {
                            li.headings = [$(el).text().toString()]
                        }
                    });
                    li.entity_tags = li.entity_tags.concat(twin.entity_tags);
                    li.group_tags = li.group_tags.concat(twin.group_tags);
                    addLi = true;
                }
            }
            if (addLi) {
                filteredList.push(li);
            }
            addLi = false;
        }
        return filteredList;
    }

    // methods that splits the full text of each advisory into the different headings and subtexts in order to narrow down the mitigations
    async getVulnFromTxt(txt: string, headings: string[]): Promise<any> {
        const vul = {};
        let tmp = txt;
        let splitted = []
        const splittingPhrase = '**---THISISTHESPLITTINGSTRINGTHATSEPERATESTHESECTIONS---**';

        for (const head of headings) {
            if (head.startsWith('1')) {
                continue
            }
            tmp = tmp.replace(head, splittingPhrase);
        }
        const find = '\n\t';
        const re = new RegExp(find, 'g');

        const find2 = '\n\n';
        const re2 = new RegExp(find2, 'g');

        const noShortcut = tmp.replace(re, '. ').replace(re2, '. ');

        splitted = noShortcut.split(splittingPhrase);

        const notes = [];
        for (const head of headings) {
            if (head.includes('MITIGATIONS')) {
                vul['remediations'] = [
                    {
                        category: 'mitigation',
                        details: splitted[headings.indexOf(head)]
                    }
                ]
            } else if (head.includes('EXECUTIVE SUMMARY')) {
                notes.push(
                    {
                        category: 'summary',
                        text: splitted[headings.indexOf(head)],
                        title: 'EXECUTIVE SUMMARY'
                    }
                )
            } else if (head.includes('TECHNICAL DETAILS')) {
                notes.push(
                    {
                        category: 'details',
                        text: splitted[headings.indexOf(head)],
                        title: 'TECHNICAL DETAILS'
                    }
                )
            }
        }
        if (notes.length !== 0) {
            vul['notes'] = notes;
        }

        return JSON.parse(JSON.stringify([vul]));
    }

    // method that maps the sourced advisories to the CSAF format and create the document with the corresponding task in the database
    async transformIntoCSAF(filteredList: ListItems[]): Promise<void> {
        console.log('CISA ICS CERT: Transform Advisories into CSAF');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const CSAF = require('../models/mongoose/csaf');

        for (const li of filteredList) {
            const vul = await this.getVulnFromTxt(li.text.toString(), li.headings);

            // CSAF mapping to create valid documents
            const file = {
                document: {
                    title: li.title + ' ' + li.description,
                    category: 'CISA ICS CERT Advisory',
                    csaf_version: "2.0",
                    publisher: {
                        name: "CISA ICS CERT",
                        category: "coordinator",
                        namespace: "https://www.cisa.gov/uscert/"
                    },
                    distribution: {
                        text: "Disclosure is not limited.",
                        tlp: {
                            label: "WHITE"
                        }
                    },
                    tracking: {
                        id: li.title,
                        status: "final",
                        version: "1",
                        revision_history: [
                            {
                                number: "1",
                                legacy_version: "1.0",
                                date: new Date().toDateString(),
                                summary: "Publication Date"
                            }
                        ],
                        initial_release_date: new Date().toDateString(),
                        current_release_date: new Date().toDateString(),
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
                            url: `https://www.cisa.gov/uscert/${li.link}`,
                            summary: li.description
                        }
                    ],
                    notes: [
                        {
                            title: 'Content Webpage',
                            category: 'general',
                            text: li.text.toString()
                        }
                    ]
                }
            };
            if (vul) {
                file['vulnerabilities'] = vul
            }

            const doc = new CSAF(file)

            await csafService.createPlusTask(doc, li.entity_tags, li.group_tags); // create CSAF and task document
            console.log('CSAF created from CISA ICS CERT Advisory');
        }
    }
}

export const cisaAdapter = new CISAAdapter();