import Dataset from "./dataset.js";
import KaplanMeier from "./kaplan-meier.js";
import LogRank from "./log_rank.js";
import OddsRatio from "./odds_ratio.js";
import CoxPH from "./cox_ph.js";
export default class DatasetGroup {
    constructor(id) {
        this._datasets = [];
        this._medical_records = [];
        this.id = id;
        this._km_object = new KaplanMeier(this.id);
        this._lr_object = new LogRank(this.id);
        this._or_object = new OddsRatio(this.id);
        this._coxph_object = new CoxPH(this.id);
        this._FetchMedicalRecords(`/cgi-bin/doctor.cgi?action=AJAX_getMedicalRecords&_=${Math.random() * 8723649}`);
    }
    get id() { return this._id; }
    set id(id) { this._id = id; }
    CreateDS() {
        const new_ds = new Dataset(this._datasets.length, this._medical_records, this._km_object, this._lr_object, this._or_object, this._coxph_object);
        this._datasets.push(new_ds);
        return new_ds;
    }
    CreateAndRenderDS() {
        const new_ds = this.CreateDS();
        const parent = document.querySelectorAll(`[dataset-group='${this.id}']`)[0];
        new_ds.AddToParent(parent);
        return new_ds;
    }
    _FetchMedicalRecords(url) {
        system_calls.ButtonLoadingDisable(document.getElementById("create_dataset"));
        fetch(url)
            .then(response => {
            if (response.ok) {
                // --- ok
                system_calls.ButtonLoadingEnable(document.getElementById("create_dataset"));
            }
            else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            if (data.result == "success") {
                this._medical_records = data.medical_records;
            }
            else {
                system_calls.PopoverError($("body"), "Ошибка: " + data.description);
            }
        })
            .catch(err => { throw new Error(err); });
    }
}
