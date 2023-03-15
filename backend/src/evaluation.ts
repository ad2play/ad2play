/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
import { csafService } from "./services/csaf";
import { playbookService } from "./services/playbook";
import { taskService } from "./services/task";

export class EVAL {

    async generateEvalOutput(): Promise<void> {
        console.log('EVALUATION: Generate CSV-Output');
        const fileName = new Date().getTime();
        // await this.initializeCSVFile(fileName);

        const createCsvWriter = require('csv-writer').createObjectCsvWriter;

        // defines the fields of the csv file
        const csvWriter = createCsvWriter({
            path: __dirname + `/EvaluationOutputs/EVAL-${fileName}.csv`,
            header: [
                { id: 'taskid', title: 'TASKID' },
                { id: 'csafid', title: 'CSAFID' },
                { id: 'playbookid', title: 'PLAYBOOKID' },
                { id: 'twin', title: 'TWIN' },
                { id: 'source', title: 'SOURCE' },
                { id: 'manual', title: 'MANUAL' },
                { id: 'nbrsteps', title: 'NBRSTEPS' },
                { id: 'nbrsentences', title: 'NBRSENTENCES' },
                { id: 'updatesteps', title: 'UPDATESTEPS' },
                { id: 'investigationsteps', title: 'INVESTIGATIONSTEPS' },
                { id: 'locatingsteps', title: 'LOCATINGSTEPS' },
                { id: 'dataoperationsteps', title: 'DATAOPERATIONSTEPS' },
                { id: 'isolationsteps', title: 'ISOLATIONSTEPS' },
                { id: 'accessactionsteps', title: 'ACCESSACTIONSTEPS' },
                { id: 'systemactionsteps', title: 'SYSTEMACTIONSTEPS' },
                { id: 'setentitysteps', title: 'SETENTITYSTEPS' },
                { id: 'trafficactionsteps', title: 'TRAFFICACTIONSTEPS' },
                { id: 'observebehavioursteps', title: 'OBSERVEBEHAVIOURSTEPS' },
            ]
        });

        const csvRecords = []

        const tasks = await taskService.list();

        // in this for loop all required data from each task is accessed
        for (const task of tasks) {
            const tmp = {
                taskid: task._id,
                nbrsteps: 0,
                updatesteps: 0,
                investigationsteps: 0,
                locatingsteps: 0,
                dataoperationsteps: 0,
                isolationsteps: 0,
                accessactionsteps: 0,
                systemactionsteps: 0,
                setentitysteps: 0,
                trafficactionsteps: 0,
                observebehavioursteps: 0,
            }

            const csafDoc = await csafService.getByID(task.csaf_files[0]);
            tmp['csafid'] = csafDoc._id;
            tmp['twin'] = task.entity_tags[0];
            tmp['manual'] = task.manual_action_required;
            tmp['source'] = csafDoc.document.publisher.name;

            if (task.playbook.length !== 0) {
                const pbDoc = await playbookService.getByID(task.playbook[0]);
                tmp['playbookid'] = pbDoc._id;

                const workflow = JSON.parse(JSON.stringify(pbDoc.workflow));
                for (const id in workflow) {
                    const stepType = workflow[id].name;

                    switch (stepType) {
                        case 'Update-Step':
                            tmp.updatesteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Investigation-Step':
                            tmp.investigationsteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Locating-Step':
                            tmp.locatingsteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Data-Operation-Step':
                            tmp.dataoperationsteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Isolation-Step':
                            tmp.isolationsteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Access-Action-Step':
                            tmp.accessactionsteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'System-Action-Step':
                            tmp.systemactionsteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Set-Entity-Step':
                            tmp.setentitysteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Traffic-Action-Step':
                            tmp.trafficactionsteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                        case 'Observe-Behaviour-Step':
                            tmp.observebehavioursteps += 1;
                            tmp.nbrsteps += 1;
                            break;
                    }
                }
            }
            tmp['nbrsentences'] = await this.getNumberSentences(csafDoc);
            csvRecords.push(JSON.parse(JSON.stringify(tmp)));
        }

        csvWriter.writeRecords(csvRecords)
            .then(() => {
                console.log('CSV file generated!');
            });

        await this.generalInformation(csvRecords);

    }

    async getNumberSentences(csaf: any): Promise<number> {
        let sentences = [];

        // same splitting algorithm as used in the playbook generation
        for (const vul of csaf.vulnerabilities) {
            for (const rem of vul.remediations) {
                const find = 'incl.';
                const re = new RegExp(find, 'g');

                const noShortcut = rem.details.replace(re, 'incl'); // changing incl shortcut, so no point irritates the sentence splitting algorithm

                const tmp = noShortcut.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|'); // complex regular expression for splitting the text in sentences.                
                sentences = sentences.concat(tmp);
            }
        }
        return sentences.length;
    }

    // analyses the single records to get some general data
    async generalInformation(csvRecords: any[]): Promise<void> {
        let ciscoTwin = 0;
        let siemensTwin = 0;

        let nbrSteps = 0;
        let nbrSentences = 0;

        let nbrManual = 0
        let nbrAutomatic = 0;

        let nvd = 0;
        let ibm = 0;
        let cisco = 0;
        let siemens = 0;
        let cisa = 0;

        let updatesteps = 0;
        let investigationsteps = 0;
        let locatingsteps = 0;
        let dataoperationsteps = 0;
        let isolationsteps = 0;
        let accessactionsteps = 0;
        let systemactionsteps = 0;
        let setentitysteps = 0;
        let trafficactionsteps = 0;
        let observebehavioursteps = 0;

        for (const rec of csvRecords) {
            if (rec.twin === 'SOAR4IoT:Mock_Siemens') {
                siemensTwin += 1;
            } else if (rec.twin === 'SOAR4IoT:Mock_Cisco') {
                ciscoTwin += 1;
            }

            nbrSteps += rec.nbrsteps;
            nbrSentences += rec.nbrsentences;

            if (rec.manual) {
                nbrManual += 1;
            } else {
                nbrAutomatic += 1;
            }

            if (rec.source === 'NVD') {
                nvd += 1;
            } else if (rec.source === 'IBM') {
                ibm += 1;
            } else if (rec.source === 'CISCO') {
                cisco += 1;
            } else if (rec.source === 'Siemens ProductCERT') {
                siemens += 1;
            } else if (rec.source === 'CISA ICS CERT') {
                cisa += 1;
            }

            updatesteps += rec.updatesteps;
            investigationsteps += rec.investigationsteps;
            locatingsteps += rec.locatingsteps;
            dataoperationsteps += rec.dataoperationsteps;
            isolationsteps += rec.isolationsteps;
            accessactionsteps += rec.accessactionsteps;
            systemactionsteps += rec.systemactionsteps;
            setentitysteps += rec.setentitysteps;
            trafficactionsteps += rec.trafficactionsteps;
            observebehavioursteps += rec.observebehavioursteps;
        }

        // console logs for presenting the general information
        console.log('EVALUATION RESULTS ***********************************************************************************************')

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('Source Composition:')
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('NVD: ' + nvd);
        console.log('IBM: ' + ibm);
        console.log('Cisco: ' + cisco);
        console.log('Siemens: ' + siemens);
        console.log('CISA: ' + cisa);

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('Twin Composition:')
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('CiscoTwin: ' + ciscoTwin);
        console.log('SiemensTwin: ' + siemensTwin);

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('Playbook Generation:')
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('Manual Action Required: ' + nbrManual);
        console.log('automatically Generated: ' + nbrAutomatic);

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('Step Types:')
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('Update: ' + updatesteps);
        console.log('Investigation: ' + investigationsteps);
        console.log('Locating: ' + locatingsteps);
        console.log('DataOperation: ' + dataoperationsteps);
        console.log('Isolation: ' + isolationsteps);
        console.log('AccessAction: ' + accessactionsteps);
        console.log('SystemAction: ' + systemactionsteps);
        console.log('SetEntity: ' + setentitysteps);
        console.log('TrafficAction: ' + trafficactionsteps);
        console.log('ObserveBehaviour: ' + observebehavioursteps);

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('General quantity:')
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('NBR of Steps: ' + nbrSteps);
        console.log('NBR of Sentences: ' + nbrSentences);
    }
}

export const evaluate = new EVAL();