import Dataset from "./dataset.js"
import KaplanMeier from "./kaplan-meier.js"

export default class DatasetGroup {
	_datasets = [];
	_medical_records = [];

	constructor(id) {
		this.id = id;
		this._km_object = new KaplanMeier(this.id);
		this._FetchMedicalRecords("/cgi-bin/doctor.cgi?action=AJAX_getMedicalRecords&_=" + Math.random() * 872364982374629234);
	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

	CreateDS() {
		let new_ds = new Dataset(this._datasets.length, this._medical_records, this._km_object);

		this._datasets.push(new_ds);

		return new_ds;
	}

	CreateAndRenderDS() {
		let new_ds = this.CreateDS();

		new_ds.AddToParent(document.querySelectorAll("[dataset-group='" + this.id + "'")[0]);

		return new_ds;
	}

	_FetchMedicalRecords(url) {
		fetch(url)
			.then(response => {
			    if (response.ok) {
			    	// --- ok
			    } else {
			      throw new Error(`HTTP error! Status: ${ response.status }`);
			    }

				return response.json();
			})
			.then(data => {
				if(data.result == "success") {
					this._medical_records = this._PreprocessData(data.medical_records);
				} else {
					system_calls.PopoverError($("body"), "Ошибка: " + data.description);
				}
			})
			.catch(err => {throw new Error(err)});
	}


	_AddStatusField(medical_records) {
		for (let i = 0; i < medical_records.length; i++) {
			let record = medical_records[i]

			if(record.___death_date.length) { record.___calculated_status = "event"; }
			else if(record.___study_retirement_date.length) {  record.___calculated_status = "censored"; }
			else { record.___calculated_status = "alive"; }
		}

		return medical_records;
	};

	_PreprocessData(medical_records) {
		medical_records = this._AddStatusField(medical_records);
		return medical_records;
	}
}
