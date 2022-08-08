import DatasetPreprocess from "./data_preprocess.js"

class MonthPredictor {
	_medical_records = [];

	async Do() {
		this._medical_records = await this._FetchMedicalRecords("/cgi-bin/doctor.cgi?action=AJAX_getMedicalRecords&_=" + Math.random() * 872364982374629234);
		this._DataPreprocess();
	}

	_DataPreprocess() {
		let dp = new DatasetPreprocess(this._medical_records);
		let result = dp.Do();
		if(result.error instanceof Error)
	}

	_FetchMedicalRecords(url) {

		return fetch(url)
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
					// --- ok
					return data.medical_records;
				} else {
					system_calls.PopoverError($("body"), "Ошибка: " + data.description);
				}
			})
			.catch(err => {throw new Error(err)});
	}

}

let obj = new MonthPredictor();
obj.Do();
