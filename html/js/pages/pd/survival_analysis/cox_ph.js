import { coxphFit } from './coxph/modules/cox-univariate.js';

export default class CoxPH {

    constructor(id) {
        this.id = id;
        this._datasets = [];
    }

    get id() { return this._id; }
    set id(id) { this._id = id; }

    _NewDatasetObject(parent_id) {
        return {
            parent_id: parent_id,
            data: [],
        }
    }

    _FindDSIndexByParentID(parent_id) {
        let datasets = this._datasets;
        let ds_idx;

        for (ds_idx = 0; ds_idx < datasets.length; ++ds_idx) {
            if (datasets[ds_idx].parent_id == parent_id) {
                break;
            }
        }

        return ds_idx;
    }

    // Replaces dataset with parent_id in datasets array with one provided as a parameter
    // Output: none 
    UpdateDataset(parent_id, data) {
        let datasets = this._datasets;
        let ds_idx = this._FindDSIndexByParentID(parent_id);

        if (ds_idx == datasets.length) {
            datasets.push(this._NewDatasetObject(parent_id));
        }

        datasets[ds_idx].data = data;
    }

    // Remove dataset from datasets[]
    RemoveDataset(parent_id) {
        let datasets = this._datasets;
        let ds_idx = this._FindDSIndexByParentID(parent_id);

        if (ds_idx == datasets.length) {
            // --- ok
        } else {
            datasets.splice(ds_idx, 1);
        }
    }

    UpdateUI() {
        // Update UI logic here if needed
    }
}
