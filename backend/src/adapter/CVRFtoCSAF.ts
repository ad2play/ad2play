/* eslint-disable @typescript-eslint/no-explicit-any */
import xml2js from 'xml2js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CSAF = require('../models/mongoose/csaf');

// Converter class for transforming CVRF XML files into CSAF JSON files
export class CVRFtoCSAF {

    // main entry method that coordinates all sub methods for the converting actions
    async convert(cvrf: string, source: string, link: string): Promise<typeof CSAF> {
        const parser = new xml2js.Parser();
        const response = await parser.parseStringPromise(cvrf);

        const jsonCVRF = response['cvrf:cvrfdoc'];

        // file is built with the help of smaller methods that return the individual components
        const file = new CSAF({
            document: {
                title: jsonCVRF['cvrf:DocumentTitle'][0],
                category: jsonCVRF['cvrf:DocumentType'][0],
                description: jsonCVRF['cvrf:DocumentTitle'][0],
                csaf_version: "2.0",
                publisher: await this.getPublisher(jsonCVRF, source, link),
                distribution: {
                    text: "Disclosure is not limited.",
                    tlp: {
                        label: "WHITE"
                    }
                },
                tracking: await this.getTracking(jsonCVRF['cvrf:DocumentTracking'][0]),
                notes: await this.getNotes(jsonCVRF['cvrf:DocumentNotes'][0]['cvrf:Note']),
                references: await this.getDocReferences(jsonCVRF['cvrf:DocumentReferences'][0]['cvrf:Reference']),
            },
            product_tree: await this.getProductTree(jsonCVRF['ProductTree'][0]),
            vulnerabilities: await this.getVulnerabilities(jsonCVRF['Vulnerability'])
        });


        return file;
    }

    // method for getting the publisher object
    async getPublisher(doc: unknown, source: string, link: string): Promise<any> {

        // enumerations are kept compliant for each standard
        const cvrfKeys = ['Coordinator', 'Discoverer', 'Other', 'User', 'Vendor'];
        const csafKeys = ['coordinator', 'discoverer', 'other', 'user', 'vendor'];

        const publisherData = {
            name: source,
            namespace: link,
            issuing_authority: doc['cvrf:DocumentPublisher'][0]['cvrf:IssuingAuthority'],
            contact_details: doc['cvrf:DocumentPublisher'][0]['cvrf:ContactDetails']
        };

        const cat = cvrfKeys.indexOf(doc['cvrf:DocumentPublisher'][0]['$']['Type']);
        if (cat !== (-1)) {
            publisherData['category'] = csafKeys[cat];
        }

        return JSON.parse(JSON.stringify(publisherData));
    }

    // method for getting the tracking objet
    async getTracking(tracking: unknown[]): Promise<any> {

        const trackData = {
            id: tracking['cvrf:Identification'][0]['cvrf:ID'][0],
            status: tracking['cvrf:Status'],
            version: tracking['cvrf:Version'],
            revision_history: [],
            initial_release_date: new Date(tracking['cvrf:InitialReleaseDate']).toISOString(),
            current_release_date: new Date(tracking['cvrf:CurrentReleaseDate']).toISOString(),
            generator: {
                engine: {
                    name: tracking['cvrf:Generator'][0]['cvrf:Engine'][0]
                }
            }
        };

        if (tracking['cvrf:RevisionHistory']) {
            if (tracking['cvrf:RevisionHistory'][0]) {
                if (tracking['cvrf:RevisionHistory'][0]['cvrf:Revision']) {
                    for (const rev of tracking['cvrf:RevisionHistory'][0]['cvrf:Revision']) {
                        trackData.revision_history.push(
                            {
                                date: rev['cvrf:Date'][0],
                                number: rev['cvrf:Number'][0],
                                summary: rev['cvrf:Description'][0]
                            }
                        )
                    }
                }
            }
        }
        return JSON.parse(JSON.stringify(trackData));
    }

    // method for getting the note object
    async getNotes(notes: unknown[]): Promise<any> {

        // enumerations are kept compliant
        const cvrfKeys = ['Description', 'Details', 'FAQ', 'Legal Disclaimer', 'Other', 'Summary', 'General'];
        const csafKeys = ['description', 'details', 'faq', 'legal_disclaimer', 'other', 'summary', 'general'];

        const notesData = [];
        for (const note of notes) {
            const tmp = {};
            const cat = cvrfKeys.indexOf(note['$']['Type']);
            if (cat !== (-1)) {
                tmp['category'] = csafKeys[cat];
            }
            tmp['title'] = note['$']['Title'];
            tmp['text'] = note['_'];

            if (tmp['category'] && tmp['title'] && tmp['text']) {
                notesData.push(tmp);
            }
        }
        return JSON.parse(JSON.stringify(notesData));
    }

    // method for getting the references
    async getDocReferences(references: unknown[]): Promise<any> {

        const referenceData = [];
        for (const ref of references) {
            const tmp = {
                summary: ref['cvrf:Description'][0],
                url: ref['cvrf:URL'][0]
            }

            if (ref['$']) {
                if (ref['$']['Type']) {
                    tmp['category'] = ref['$']['Type'].toLowerCase()
                }
            }
            referenceData.push(tmp)
        }
        return JSON.parse(JSON.stringify(referenceData));
    }

    // method for getting the vulnerability references
    async getVulnReferences(references: unknown[]): Promise<any> {
        const referenceData = [];
        for (const ref of references) {
            const tmp = {
                summary: ref['Description'][0],
                url: ref['URL'][0]
            }

            if (ref['$']) {
                if (ref['$']['Type']) {
                    tmp['category'] = ref['$']['Type'].toLowerCase()
                }
            }
            referenceData.push(tmp)
        }
        return JSON.parse(JSON.stringify(referenceData));
    }

    // method for getting the product tree branches
    async getBranches(branch: unknown[]): Promise<any> {
        const branchArr = [];
        for (const bra of branch) {
            const branchData = {};
            branchData['category'] = bra['$']['Type'];
            branchData['name'] = bra['$']['Name'];

            if (bra['Branch']) {
                branchData['branches'] = await this.getBranches(bra['Branch']);
            }

            if (bra['FullProductName']) {
                branchData['product'] = {
                    name: bra['FullProductName'][0]['_'],
                    product_id: bra['FullProductName'][0]['$']['ProductID']
                }
            }
            branchArr.push(branchData)
        }

        return JSON.parse(JSON.stringify(branchArr));
    }

    // method for getting the complete product tree
    async getProductTree(productTree: unknown): Promise<any> {
        const productTreeData = {};
        if (productTree['Branch']) {
            productTreeData['branches'] = await this.getBranches(productTree['Branch']);
        }
        return JSON.parse(JSON.stringify(productTreeData));
    }

    // method for getting the product status
    async getProductStatus(status: unknown[]): Promise<any> {
        const productStatusData = {};

        // enumerations are kept compliant
        const cvrfKeys = ['First Affected', 'Known Affected', 'Known Not Affected', 'First Fixed', 'Fixed', 'Recommended', 'Last Affected'];
        const csafKeys = ['first_affected', 'known_affected', 'known_not_affected', 'first_fixed', 'fixed', 'recommended', 'last_affected'];
        for (const sta of status) {
            const tmp = cvrfKeys.indexOf(sta['$']['Type']);
            if (tmp !== (-1)) {
                if (productStatusData[csafKeys[tmp]]) {
                    productStatusData[csafKeys[tmp]] = productStatusData[csafKeys[tmp]].concat(sta['ProductID']);
                } else {
                    productStatusData[csafKeys[tmp]] = sta['ProductID'];
                }
            }
        }
        return JSON.parse(JSON.stringify(productStatusData));
    }

    // method for getting the scores of the vulnerability criticality
    async getScores(scores: unknown[], products: unknown[]): Promise<any> {
        const relevantKeys = ['first_affected', 'known_affected', 'last_affected'];

        let prods = [];
        if (products) {
            for (const key of relevantKeys) {
                if (products[key]) {
                    prods = prods.concat(products[key]);
                }
            }
        }
        if (prods.length !== 0) {
            const scoresData = [];
            for (const scr of scores) {
                const tmp = {
                    products: prods
                };
                if (scr['ScoreSetV2']) {
                    tmp['cvss_v2'] = {
                        version: '2.0',
                        baseScore: scr['ScoreSetV2'][0]['BaseScoreV2'][0],
                        vectorString: scr['ScoreSetV2'][0]['VectorV2'][0]
                    }
                }

                if (scr['ScoreSetV3']) {
                    tmp['cvss_v3'] = {
                        version: '3.0',
                        baseScore: scr['ScoreSetV3'][0]['BaseScoreV3'][0],
                        vectorString: scr['ScoreSetV3'][0]['VectorV3'][0]
                    }
                }
                scoresData.push(tmp);
            }
            return JSON.parse(JSON.stringify(scoresData));
        } else {
            return null;
        }

    }

    // method for getting the remediation descriptions for the vulnerability
    async getRemediations(remediations: unknown[]): Promise<any> {
        const remediationsData = [];

        // enumerations are kept compliant
        const cvrfKeys = ['Workaround', 'Mitigation', 'Vendor Fix', 'None Available', 'Will Not Fix'];
        const csafKeys = ['workaround', 'mitigation', 'vendor_fix', 'none_available', 'no_fix_planned'];

        for (const rem of remediations) {
            const tmp = {};
            const cat = cvrfKeys.indexOf(rem['$']['Type']);
            if (cat !== (-1)) {
                tmp['category'] = csafKeys[cat];
            }
            tmp['details'] = rem['Description'][0];
            remediationsData.push(tmp);
        }

        return JSON.parse(JSON.stringify(remediationsData));
    }

    // method for getting the vulnerabilities -> more methods are combined in order to produce the complete object construct
    async getVulnerabilities(vulnerabilities: unknown[]): Promise<any> {
        const vulnerabilitiesData = [];
        for (const vul of vulnerabilities) {
            const vulnerability = {
                cve: vul['CVE'][0],
                title: vul['Title'][0]
            }

            if (vul['Notes']) {
                vulnerability['notes'] = await this.getNotes(vul['Notes'][0]['Note']);
            }

            if (vul['References']) {
                vulnerability['references'] = await this.getVulnReferences(vul['References'][0]['Reference']);
            }

            if (vul['ProductStatuses']) {
                vulnerability['product_status'] = await this.getProductStatus(vul['ProductStatuses'][0]['Status']);
            }

            if (vul['CVSSScoreSets']) {
                vulnerability['scores'] = await this.getScores(vul['CVSSScoreSets'], vulnerability['product_status']);
            }

            if (vul['Remediations']) {
                vulnerability['remediations'] = await this.getRemediations(vul['Remediations'][0]['Remediation']);
            }

            vulnerabilitiesData.push(vulnerability);
        }

        return JSON.parse(JSON.stringify(vulnerabilitiesData));
    }
}

export const cvrfToCsaf = new CVRFtoCSAF();