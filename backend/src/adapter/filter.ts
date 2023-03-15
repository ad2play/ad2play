/* eslint-disable @typescript-eslint/no-explicit-any */
import { TwinSearch } from '../services/dataAcquisition';

// general filter class to be used from every other source adapter if needed
export class Filter {

    // method for filtering a set of JSON data by the twins matching terms
    async filterData(unfiltered: JSON[], twins: TwinSearch[]): Promise<any[][]> {
        try {
            const res = [];
            const twinTags = [];
            for (const li of unfiltered) {
                const tags = {
                    entity_tags: [],
                    group_tags: []
                }
                let liAdded = false;

                for (const twin of twins) {
                    const included = twin.matching_terms.some(element => {
                        if (JSON.stringify(li).includes(element)) {
                            return true;
                        }
                        return false;
                    })
                    if (included) {
                        if (!liAdded) {
                            res.push(li);
                            liAdded = true;
                        }
                        tags.entity_tags = tags.entity_tags.concat(twin.entity_tags);
                        tags.group_tags = tags.group_tags.concat(twin.group_tags);
                    }
                }
                if (liAdded) twinTags.push(tags);
                liAdded = false;
            }
            return [res, twinTags];
        } catch (err) {
            // console.log(err);
            return null;
        }
    }

    // method for deleting duplicates of a given array
    async deleteDuplicates(res: any[]): Promise<any[]> {
        try {
            const uniqueArray = res.filter((value, index) => {
                const _value = JSON.stringify(value);
                return index === res.findIndex(obj => {
                    return JSON.stringify(obj) === _value;
                });
            });
            return uniqueArray;

        } catch (err) {
            // console.log(err);
            return null;
        }
    }
}

export const filter = new Filter();