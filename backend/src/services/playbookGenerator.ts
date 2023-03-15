/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { csafService } from './csaf';
import { taskService } from './task';
import { removeStopwords } from 'stopword';
import { patternService } from './pattern';
import { uuidv5 } from './uuidGenerator';
import { canonicalize } from 'json-canonicalize';
import { playbookService } from './playbook';
import { dataAcquisitionService } from './dataAcquisition';

const Task = require('../models/mongoose/task')
const CSAF = require('../models/mongoose/csaf')
const Pattern = require('../models/mongoose/pattern')
const Playbook = require('../models/mongoose/playbook')
const nlp = require('wink-nlp-utils');
const posTagger = require('wink-pos-tagger');

// service that includes the complete process for automatically generating playbooks if possible
export class PlaybookGeneratorService {

    // central entry method for the service -> scans for tasks that are not done and not set as manual yet
    public async scanTasks(): Promise<void> {
        console.log('PlaybookGeneratorService: START');
        const openTasks = await taskService.getNotDoneAndNotManual();
        for (const task of openTasks) {
            await this.generate(task);
        }
        console.log('PlaybookGeneratorService: END');
    }

    // handling method that coordinates the investigation of each task
    public async generate(task: typeof Task): Promise<void> {
        const csafFiles = [];
        for (const file of task.csaf_files) {
            const tmp = await csafService.getByID(file); // get the CSAF file(s) related to the task
            if (tmp) {
                csafFiles.push(tmp);
            }
        }
        await this.csafToCacao(csafFiles, task); // investigate the CSAF file for creating a playbook
    }

    // method that investigates the remediations described in the CSAF document for actions
    public async csafToCacao(csaf: typeof CSAF[], task: typeof Task): Promise<void> {
        try {
            let sentences = [];
            const csafIds = [];

            // all CSAF files of the task are iterated through and all remediation sentences are added to the sentence array for further processing
            for (const file of csaf) {
                csafIds.push(file._id)
                for (const vul of file.vulnerabilities) {
                    for (const rem of vul.remediations) {
                        const find = 'incl.';
                        const re = new RegExp(find, 'g');

                        const noShortcut = rem.details.replace(re, 'incl'); // changing incl shortcut, so no point irritates the sentence splitting algorithm

                        const tmp = noShortcut.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|'); // complex regular expression for splitting the text in sentences.

                        let productNames = [];
                        if (rem.product_ids) { // if the remediation contains product ids the corresponding product names are searched in order to identify the target of the action
                            if (rem.product_ids.length !== 0) {
                                productNames = await this.getProductNamesById(file, rem.product_ids);
                                if (await this.productIncludedInTwin(productNames)) {
                                    const senPlusProduct = [];
                                    for (const t of tmp) {
                                        senPlusProduct.push(t + ' [' + await this.excludeIrrelevant(productNames) + ']'); // adds the product names to the sentence to provide more specific information for the system and the user
                                    }
                                    sentences = sentences.concat(senPlusProduct);
                                }
                            } else {
                                sentences = sentences.concat(tmp); // when no product name can be found the sentence is added without the extra information
                            }
                        } else {
                            sentences = sentences.concat(tmp); // for the case that the remediation doesn't contain any product id the sentence is added as is
                        }
                    }
                }
            }

            let steps = [];
            if (sentences.length === 0) {
                await this.setTaskManual(task); // if there are no sentences to be investigated the task is set for manual execution 
            } else {
                steps = await this.investigateSentences(sentences, task); // if there are sentences they are investigated using the pattern based approach
            }

            if (steps.length === 0) {
                await this.setTaskManual(task); // if the pattern approach doesn't return any steps the task is also set as manual
            } else {
                const workflow = await this.castStepsIntoWorkflow(await this.deleteDuplicates(steps)); // if the pattern approach returns one or multiple steps they are embedded in a workflow

                // general frame of the generated playbooks
                const playbook = {
                    type: 'playbook',
                    spec_version: '1.0',
                    id: await uuidv5.getUUID(canonicalize(workflow), 'playbook'), // uuid compliant to the CACAO standard
                    name: `AUTOGENERATED Playbook from sourced CSAF file(s) ${csafIds.toString()}`,
                    playbook_types: [
                        'investigation',
                        'prevention',
                        'mitigation',
                        'remediation'
                    ],
                    created_by: await uuidv5.getUUID(canonicalize('SOAR-Platform-Backend'), 'identity'),
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    valid_from: new Date().toISOString()
                }

                playbook['workflow'] = workflow;
                playbook['workflow_start'] = Object.keys(workflow)[0];

                const references = []
                for (const id of csafIds) { // the CSAF file is referenced as source of the playbooks
                    references.push(
                        {
                            name: 'CSAF File',
                            description: 'This reference provides the id of one CSAF file that was used for the creation of the playbook',
                            source: 'SOAR-Platform-Backend',
                            external_id: id
                        }
                    )
                }

                if (references.length !== 0) {
                    playbook['external_references'] = references;
                }

                const pb = await playbookService.create(playbook); // the playbook is saved to the database
                await this.completeTask(task, pb); // the playbook is saved to the task and the task is set as done
            }
        } catch (err) {
            console.log(err)
        }
    }

    // method for delting irrelevant products from a string array filled with product names
    public async excludeIrrelevant(products: string[]): Promise<string> {
        const twinData = await dataAcquisitionService.getTwinData();
        let twinTerms = [];
        for (const twin of twinData) {
            twinTerms = twinTerms.concat(twin.matching_terms);
        }

        const ret = [];
        for (const prod of products) {
            for (const term of twinTerms) {
                if (prod.includes(term)) {
                    ret.push(prod)
                }
            }
        }
        return ret.toString();
    }

    // method that checks if a string array filled with product names includes an instance relevant to the twins
    public async productIncludedInTwin(products: string[]): Promise<boolean> {
        const twinData = await dataAcquisitionService.getTwinData();
        let twinTerms = [];
        for (const twin of twinData) {
            twinTerms = twinTerms.concat(twin.matching_terms);
        }

        for (const prod of products) {
            for (const term of twinTerms) {
                if (prod.includes(term)) {
                    return true;
                }
            }
        }
        return false;
    }

    // method that transforms an array of product ids into an array of product names by searching the product tree
    public async getProductNamesById(csaf: typeof CSAF, ids: string[]): Promise<string[]> {
        const prodTree = csaf.product_tree;
        const ret = [];

        for (const id of ids) {
            for (const branch of prodTree.branches) {
                ret.push(this.searchTree(branch, id))
            }
        }
        return ret;
    }

    // delete duplicate steps in the workflow since it doesn't make any sense
    public async deleteDuplicates(steps: any[]): Promise<any[]> {
        const stepArr = steps;
        const ret = [];

        for (const s of stepArr) {
            if (!(ret.some(e => e.step_variables['[$$action_description$$]'].value === s.step_variables['[$$action_description$$]'].value))) {
                ret.push(s)
            }
        }
        return ret;
    }

    // recursive method for searching the product tree used by the id->product name method
    public searchTree(element: any, id: string): string {
        if (element.product) {
            if (element.product.product_id === id) {
                return element.product.name;
            }
        }

        if (element.branches) {
            let result = null;
            for (let i = 0; result == null && i < element.branches.length; i++) {
                result = this.searchTree(element.branches[i], id);
            }
            return result;
        }
        return null;
    }

    // cast the identified steps into the CACAO playbook workflow 
    public async castStepsIntoWorkflow(steps: any[]): Promise<any> {
        let transformed = [];
        let stepIds = [];
        const tmp = steps.reverse(); // workflow must be built back to front because the ids are related to the following steps of the workflow

        // start step must be included in any workflow as defined by the CACAO standard
        const startStep = {
            type: 'start',
            name: 'Start Playbook',
            on_completion: ''
        }

        // end step must be included in any workflow as defined by the CACAO standard
        const endStep = {
            type: 'end',
            name: 'End Playbook'
        }

        transformed.push(endStep); // end step is added in the beginning because the workflow is built from end to start
        let lastStepId = await uuidv5.getUUID(canonicalize(endStep), 'step');
        stepIds.push(lastStepId);

        // the steps are dynamically added based on the quantity
        for (let i = 0; i < tmp.length; i++) {
            const step = tmp[i];
            step.on_success = lastStepId;
            transformed.push(step);
            lastStepId = await uuidv5.getUUID(canonicalize(step), 'step');
            stepIds.push(lastStepId);
        }

        startStep.on_completion = lastStepId;
        transformed.push(startStep);
        lastStepId = await uuidv5.getUUID(canonicalize(startStep), 'step');
        stepIds.push(lastStepId);

        // at the end both arrays are reversed again in order to have the correct order
        transformed = transformed.reverse();
        stepIds = stepIds.reverse();

        const ret = {};
        for (let i = 0; i < stepIds.length; i++) {
            ret[stepIds[i]] = transformed[i]; // builts the dictionary with the generated uuidv5's as the keys
        }
        return ret;
    }

    // method for checking the sentences for the occurence of any pattern
    public async investigateSentences(sentences: string[], task: typeof Task): Promise<any[]> {
        const tokenized = await this.getSentencesTokenized(sentences); // sentences are tokenized to ease further steps
        const patterns = await patternService.list(); // get all patterns of the database
        const ret = [];

        let tmpStep = null;
        for (const s of tokenized) { // iterate through all the tokenized sentences
            for (const pat of patterns) { // iterate through all the patterns

                if (await this.checkIfMatch(pat, s)) { // check if a pattern is applicable to the sentence
                    const sent = sentences[tokenized.indexOf(s)].split('[')[0];
                    const replaced = sent.split('.').join('*'); // avoid false splitting to foolow by removing the full stops and change them with stars

                    const tagger = posTagger(); // sentences are part of speech tagged
                    const pos = await tagger.tagSentence(replaced);

                    const taggedWords = pos.filter(function (el) { // punctuations and symbols are filtered out
                        return el.tag !== 'punctuation' && el.tag !== 'symbol';
                    });
                    tmpStep = await this.analyzePattern(sentences[tokenized.indexOf(s)], taggedWords, pat, task); // pattern is analysed to retrieve the full step for the workflow
                    ret.push(JSON.parse(JSON.stringify(tmpStep)));
                }
            }
        }
        return ret;
    }

    // method that generates the full step that can be included in the CACAO playbook workflow
    public async analyzePattern(sentence: string, pos: any[], pat: typeof Pattern, task: typeof Task): Promise<any[]> {

        const f = pos.filter(function (el) { // only nouns are extracted from the part of speech tagged words
            return el.pos.startsWith('N');
        });

        const nouns = [];
        for (const n of f) {
            nouns.push(n.value);
        }

        const step = pat.workflow_step;
        step.step_variables = {
            '[$$action_description$$]': { // the description contains the full sentence that triggered the pater plus the related product names if any were given
                type: 'string',
                description: 'This is the sentence that triggered the Pattern and includes the action',
                value: sentence,
                constant: true
            },
            '[$$sentence_noun_tags$$]': { // the noun tags contain each noun of the sentence and can be used for whatever 
                type: 'string',
                description: 'This is the stringified array of the nouns used in the sentence that triggered the pattern',
                value: nouns.toString(),
                constant: true
            },
            '[$$entity_tags$$]': { // entity tags reference the twins that are affected
                type: 'string',
                description: 'These are the entity_tags related to the Twins',
                value: task.entity_tags.toString(),
                constant: true
            },
            '[$$group_tags$$]': { // references groups of twins
                type: 'string',
                description: 'These are the group_tags related to the Twins',
                value: task.group_tags.toString(),
                constant: true
            }
        }
        return step;
    }

    // method that returns a 2d array [sentence][tokenized words of the sentence]
    public async getSentencesTokenized(sentences: string[]): Promise<string[][]> {
        const tokenized = [];

        for (const sent of sentences) {
            const tok = await nlp.string.tokenize(sent, false);
            tokenized.push(nlp.tokens.stem(await removeStopwords(tok)));
        }
        return tokenized;
    }

    // method to alter the task to require manual action
    public async setTaskManual(task: typeof Task): Promise<void> {
        task.manual_action_required = true;
        task.modified = new Date();
        await taskService.update(task);
    }

    // method to alter the task to done
    public async completeTask(task: typeof Task, playbook: typeof Playbook): Promise<void> {
        task.done = true;
        task.playbook = [playbook._id];
        await taskService.update(task);
    }

    // method that checks if a tokenized sentence fulfills the requirements of any pattern and returns a boolean value
    public async checkIfMatch(pat: typeof Pattern, tokenized: string[]): Promise<boolean> {
        let bool = true;
        const matchers = pat.matching_terms;
        for (const mat of matchers) {
            const stemmedMat = await nlp.tokens.stem(mat)
            if (!stemmedMat.some(v => tokenized.includes(v))) {
                bool = false;
            }
        }
        return bool;
    }
}

export const playbookGeneratorService = new PlaybookGeneratorService();