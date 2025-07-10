import Dataset from "./dataset.js";
import KaplanMeier from "./kaplan-meier.js";
import LogRank from "./log_rank.js";
import OddsRatio from "./odds_ratio.js";
import CoxPH from "./cox_ph.js";

// Declare global variables for system_calls and jQuery
// @ts-ignore
declare const system_calls: any;
// @ts-ignore
declare const $: any;

export default class DatasetGroup {
	private _datasets: Dataset[];
	private _medical_records: any[];
	private _id!: number;
	private _km_object: KaplanMeier;
	private _lr_object: LogRank;
	private _or_object: OddsRatio;
	private _coxph_object: CoxPH;

	constructor(id: number) {
		this._datasets = [];
		this._medical_records = [];
		this.id = id;
		this._km_object = new KaplanMeier(this.id);
		this._lr_object = new LogRank(this.id);
		this._or_object = new OddsRatio(this.id);
		this._coxph_object = new CoxPH(this.id);
		this._FetchMedicalRecords(`/cgi-bin/doctor.cgi?action=AJAX_getMedicalRecords&_=${Math.random() * 8723649}`);
	}

	get id(): number { return this._id; }
	set id(id: number) { this._id = id; }

	public CreateDS(): Dataset {
		const new_ds = new Dataset(
			this._datasets.length,
			this._medical_records,
			this._km_object,
			this._lr_object,
			this._or_object,
			this._coxph_object
		);
		this._datasets.push(new_ds);
		return new_ds;
	}

	public CreateAndRenderDS(): Dataset {
		const new_ds = this.CreateDS();
		const parent = document.querySelectorAll(`[dataset-group='${this.id}']`)[0] as HTMLElement;
		new_ds.AddToParent(parent);
		return new_ds;
	}

	private _FetchMedicalRecords(url: string): void {
		system_calls.ButtonLoadingDisable(document.getElementById("create_dataset"));
		fetch(url)
			.then(response => {
				if (response.ok) {
					// --- ok
					system_calls.ButtonLoadingEnable(document.getElementById("create_dataset"));
				} else {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				if (data.result == "success") {
					this._medical_records = data.medical_records;
				} else {
					system_calls.PopoverError($("body"), "Ошибка: " + data.description);
				}
			})
			.catch(err => { throw new Error(err); });
	}
}
