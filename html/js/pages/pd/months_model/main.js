import DatasetPreprocess from "./data_preprocess.js"
import TrainNN from "./train_nn.js"
import InferenceUI from "./inference_ui.js"

class MonthPredictor {

	constructor() {
		this._medical_records = [];
		this._preprocessing = null;
		this._nn = null;
	}

	async Do() {
		common_infomed_stat.ChangeStageState("_download", "fa fa-refresh fa-spin", "");
		this._medical_records = await this._FetchMedicalRecords("/cgi-bin/doctor.cgi?action=AJAX_getMedicalRecords&_=" + Math.random() * 8723649823);
		common_infomed_stat.ChangeStageState("_download", "fa fa-check", "");

		common_infomed_stat.ChangeStageState("_preprocessing", "fa fa-refresh fa-spin", "");
		let data_preprocessed = this._DataPreprocess();
		if (data_preprocessed.error instanceof Error) {
			common_infomed_stat.ChangeStageState("_preprocessing", "fa fa-times", "");
			return { error: data_preprocessed.error };
		}
		common_infomed_stat.ChangeStageState("_preprocessing", "fa fa-check", "");

		common_infomed_stat.ChangeStageState("_train", "fa fa-refresh fa-spin", "");
		let train_result = await this._TrainNN(data_preprocessed.X, data_preprocessed.Y);
		if (train_result.error instanceof Error) {
			common_infomed_stat.ChangeStageState("_train", "fa fa-times", "");
			return { error: train_result.error };
		}
		common_infomed_stat.ChangeStageState("_train", "fa fa-check", "");

		let ui = new InferenceUI(this._preprocessing, this._nn, this._medical_records);
		let result_ui = ui.RenderUI();
		if (result_ui.error instanceof Error) {
			return { error: result_ui.error };
		}
		ui.AddToPage(result_ui.dom, document.getElementById("inference_records"));

	}

	_DataPreprocess() {
		let error = null;
		this._preprocessing = new DatasetPreprocess();
		let result = this._preprocessing.fit(this._medical_records);
		if (result.error instanceof Error) {
			error = result.error;
			return { error: error };
		}

		return { X: result.X, Y: result.Y, error: error };
	}

	async _TrainNN(X, Y) {
		let error = null;

		this._nn = new TrainNN();
		let result = await this._nn.fit(X, Y);

		return { history: result, error: error };
	}

	// --- Download medical records from the server
	// input:	url		- URL to medical records
	_FetchMedicalRecords(url) {

		return fetch(url)
			.then(response => {
				if (response.ok) {
					// --- ok
				} else {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				return response.json();
			})
			.then(data => {
				if (data.result == "success") {
					// --- ok
					return data.medical_records;
				} else {
					system_calls.PopoverError($("body"), "Ошибка: " + data.description);
				}
			})
			.catch(err => { throw new Error(err) });
	}

	// --- UI update
	// input:	selector	- tag to update
	//			class_list	- classes to replace instead of existing fa-classes
	//			message		- message to write
	/*	_ChangeStageState(selector, class_list, message) {
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
	*/
}

let obj = new MonthPredictor();
obj.Do();
