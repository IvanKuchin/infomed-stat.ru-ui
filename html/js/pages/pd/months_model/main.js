import DatasetPreprocess from "./data_preprocess.js"
import TrainNN from "./train_nn.js"

class MonthPredictor {
	_medical_records = [];

	async Do() {
		this._ChangeStageState("_download", "fa fa-refresh fa-spin", "");
		this._medical_records = await this._FetchMedicalRecords("/cgi-bin/doctor.cgi?action=AJAX_getMedicalRecords&_=" + Math.random() * 872364982374629234);
		this._ChangeStageState("_download", "fa fa-check", "");

		this._ChangeStageState("_preprocessing", "fa fa-refresh fa-spin", "");
		let data_preprocessed = this._DataPreprocess();
		this._ChangeStageState("_preprocessing", "fa fa-check", "");

		this._ChangeStageState("_train", "fa fa-refresh fa-spin", "");
		this._TrainNN(data_preprocessed.X, data_preprocessed.Y);
		// this._ChangeStageState("_train", "fa fa-check", "");
	}

	_DataPreprocess() {
		let error = null;
		let dp = new DatasetPreprocess();
		let result = dp.fit(this._medical_records);
		if(result.error instanceof Error) {
			error = result.error;
			return {error: error};
		}

		return {X: result.X, Y: result.Y, error: error};
	}

	_TrainNN(X, Y) {
		let error = null

		let train = new TrainNN()
		let result = train.fit(X, Y)

		return {error: error}
	}

	// --- Download medical records from the server
	// input:	url		- URL to medical records
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

	// --- UI update
	// input:	selector	- tag to update
	//			class_list	- classes to replace instead of existsing fa-classes
	//			message		- message to write
	_ChangeStageState(selector, class_list, message) {
		let error = null;
		let image_tag = document.getElementsByClassName(selector + "-image")[0];

		if(image_tag == undefined) {
			error = new Error("tag not found");
			console.error(error);
			return {error: error};
		}

		system_calls.RemoveClassesFromTag(image_tag, "fa");
		image_tag.className += " " + class_list;

		let comment_tag = document.getElementsByClassName(selector + "-comment")[0];

		if(comment_tag == undefined) {
			error = new Error("tag not found");
			console.error(error);
			return {error: error};
		}

		comment_tag.innerHTML = message;

		return {error: error};
	}
}

let obj = new MonthPredictor();
obj.Do();
