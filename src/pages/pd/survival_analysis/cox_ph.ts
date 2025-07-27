// @ts-ignore
import { coxphFit } from './coxph/modules/cox-univariate.js';
// @ts-ignore
import { pValue } from './coxph/modules/p-value.js';

import type { CoxphFitResult } from './coxph/modules/cox-univariate.d.ts';


/// --- Types for dataset and results
export type UnivariateData = {
    T: number[];
    E: number[];
    X?: number[]; // Optional, used in CoxPH
};

type DatasetObject = {
    parent_id: number;
    data: UnivariateData;
};

type CombinedDatasetResult = {
    error: string | null;
    dataset: UnivariateData | null;
};

type CoxResult = {
    ds_idxs: [number, number];
    ds1_eventCount: number;
    ds1_totalCount: number;
    ds2_eventCount: number;
    ds2_totalCount: number;
    cox: CoxphFitResult;
    p_value: number;
};

export default class CoxPH {
    private _id: number;
    private _datasets: DatasetObject[];

    constructor(id: number) {
        this._id = id;
        this._datasets = [];
    }

    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    private _NewDatasetObject(parent_id: number): DatasetObject {
        return {
            parent_id: parent_id,
            data: { T: [], E: [] },
        };
    }

    private _FindDSIndexByParentID(parent_id: number): number {
        let datasets = this._datasets;
        let ds_idx: number;

        for (ds_idx = 0; ds_idx < datasets.length; ++ds_idx) {
            if (datasets[ds_idx].parent_id === parent_id) {
                break;
            }
        }

        return ds_idx;
    }

    // Replaces dataset with parent_id in datasets array with one provided as a parameter
    // Output: none 
    public UpdateDataset(parent_id: number, data: UnivariateData): void {
        let datasets = this._datasets;
        let ds_idx = this._FindDSIndexByParentID(parent_id);

        if (ds_idx === datasets.length) {
            datasets.push(this._NewDatasetObject(parent_id));
        }

        datasets[ds_idx].data = data;
    }

    // Remove dataset from datasets[]
    public RemoveDataset(parent_id: number): void {
        let datasets = this._datasets;
        let ds_idx = this._FindDSIndexByParentID(parent_id);

        if (ds_idx === datasets.length) {
            // --- ok
        } else {
            datasets.splice(ds_idx, 1);
        }
    }

    private _CombineDatasets(i: number, j: number): CombinedDatasetResult {
        let datasets = this._datasets;

        if (datasets[i].parent_id === datasets[j].parent_id) {
            console.error("Duplicate parent_id found in datasets (dataset " + i + ", parent ID: " + datasets[i].parent_id + "). Each dataset must have a unique parent ID.");
            return {
                error: "Duplicate parent_id",
                dataset: null,
            };
        }

        if (datasets[i].data.T.length === 0 || datasets[j].data.T.length === 0) {
            return {
                error: "One of the datasets is empty",
                dataset: null,
            };
        }

        let ds1 = datasets[i];
        let ds2 = datasets[j];

        ds1.data.X = ds1.data.T.map(() => 0);
        ds2.data.X = ds2.data.T.map(() => 1);

        let T = ds1.data.T.concat(ds2.data.T);
        let E = ds1.data.E.concat(ds2.data.E);
        let X = ds1.data.X.concat(ds2.data.X);

        return {
            error: null,
            dataset: {
                T: T,
                E: E,
                X: X,
            },
        };
    }

    private _RecalculateData(): CoxResult[] {
        let result: CoxResult[] = [];

        let datasets = this._datasets;
        for (let i = 0; i < datasets.length - 1; ++i) {
            for (let j = i + 1; j < datasets.length; ++j) {
                // calculate event counts and total counts in each dataset
                // Note: E is expected to be an array of 0s and 1s
                // where 1 indicates an event (death, failure, etc.) and 0 indicates
                // censored data (survived, not failed, etc.)
                let ds_i_eventCount = datasets[i].data.E.filter(x => x === 1).length;
                let ds_i_totalCount = datasets[i].data.E.length;

                let ds_j_eventCount = datasets[j].data.E.filter(x => x === 1).length;
                let ds_j_totalCount = datasets[j].data.E.length;

                let combined = this._CombineDatasets(i, j);
                if (combined.error) {
                    console.error(combined.error);
                    continue;
                }

                if (!combined.dataset) {
                    console.error("Invalid combined dataset");
                    continue;
                }

                // Perform Cox PH analysis
                let cox = coxphFit(combined.dataset.T, combined.dataset.E, combined.dataset.X);
                let p_value_val = pValue(cox.coef, cox.se);

                if (!cox || !cox.coef || !cox.se || !cox.hr || !cox.coef_lower || !cox.coef_upper) {
                    console.error("Cox PH analysis failed for datasets " + datasets[i].parent_id + " and " + datasets[j].parent_id);
                    continue;
                }

                result.push({
                    ds_idxs: [datasets[i].parent_id, datasets[j].parent_id],
                    ds1_eventCount: ds_i_eventCount,
                    ds1_totalCount: ds_i_totalCount,
                    ds2_eventCount: ds_j_eventCount,
                    ds2_totalCount: ds_j_totalCount,
                    cox: cox,
                    p_value: p_value_val,
                });
            }
        }

        return result;
    }

    private _eventRateDisbalance(eventCount: number, totalCount: number): boolean {
        if (totalCount === 0) return false;
        const eventRate = eventCount / totalCount;
        return eventRate < 0.05 || eventRate > 0.95;
    }

    private _RenderResult(result: CoxResult[]): string {
        if (!result || result.length === 0) {
            console.error("No result to render. Code suppose to be unreachable.");
            return "";
        }

        let errorMessages: string[] = [];

        let html = "<table class='table table-sm table-bordered table-striped'>";
        html += "<thead><tr><th>№ группы</th><th>№ группы</th><th>Coefficient</th><th>SE</th><th>HR</th><th>CI low</th><th>CI high</th><th>p-value</th></tr></thead>";
        html += "<tbody>";

        for (let res of result) {
            let ds1 = res.ds_idxs[0];
            let ds2 = res.ds_idxs[1];

            let ds1_E0 = res.ds1_totalCount - res.ds1_eventCount;
            let ds1_E1 = res.ds1_eventCount;

            let ds2_E0 = res.ds2_totalCount - res.ds2_eventCount;
            let ds2_E1 = res.ds2_eventCount;

            if (ds1_E1 < 3) {
                errorMessages.push(`Группа ${ds1} содержит менее 3 событий. Анализ невозможен.`);
                continue;
            }

            if (ds2_E1 < 3) {
                errorMessages.push(`Группа ${ds2} содержит менее 3 событий. Анализ невозможен.`);
                continue;
            }

            if (ds1_E0 + ds1_E1 < 5) {
                errorMessages.push(`Группа ${ds1} содержит менее 5 наблюдений. Анализ невозможен.`);
                continue;
            }

            if (ds2_E0 + ds2_E1 < 5) {
                errorMessages.push(`Группа ${ds2} содержит менее 5 наблюдений. Анализ невозможен.`);
                continue;
            }

            if (this._eventRateDisbalance(ds1_E1, ds1_E0 + ds1_E1)) {
                errorMessages.push(`Группа ${ds1} несбалансирована по событиям и выбытию. Анализ невозможен.`);
                continue;
            }

            if (this._eventRateDisbalance(ds2_E1, ds2_E0 + ds2_E1)) {
                errorMessages.push(`Группа ${ds2} несбалансирована по событиям и выбытию. Анализ невозможен.`);
                continue;
            }

            let coef = res.cox.coef.toFixed(4);
            let se = res.cox.se.toFixed(4);
            let hr = res.cox.hr.toFixed(4);
            let ci_low = res.cox.coef_lower.toFixed(4);
            let ci_high = res.cox.coef_upper.toFixed(4);
            let p_value_str = res.p_value.toFixed(4);

            html += `<tr>
                        <td>${ds1}<br>Событий: ${ds1_E1}<br>Выбыли + Выжили: ${ds1_E0}</td>
                        <td>${ds2}<br>Событий: ${ds2_E1}<br>Выбыли + Выжили: ${ds2_E0}</td>
                        <td>${coef}</td>
                        <td>${se}</td>
                        <td>${hr}</td>
                        <td>${ci_low}</td>
                        <td>${ci_high}</td>
                        <td>${p_value_str}</td>
                    </tr>`;
        }

        html += "</tbody></table>";

        let errorMessagesHTML = '';
        if (errorMessages.length > 0) {
            errorMessagesHTML += "<div class='alert alert-danger mt-3'><ul>";
            for (let msg of errorMessages) {
                errorMessagesHTML += `<li>${msg}</li>`;
            }
            errorMessagesHTML += "</ul></div>";
        }

        return errorMessagesHTML + html;
    }

    public UpdateUI(): void {
        let data = this._RecalculateData();

        if (data && data.length > 0) {
            let elem = document.querySelector(`[coxph-group="${this.id}"] [result]`);

            if (elem) {
                (elem as HTMLElement).innerHTML = this._RenderResult(data);
            } else {
                console.error("Element with coxph-group='" + this.id + "' and result not found.");
            }
        }
    }
}
