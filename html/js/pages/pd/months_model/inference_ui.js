export default class InferenceUI {


	constructor(preprocessing, nn, records) {
		this._preprocessing = preprocessing;
		this._nn = nn;
		this._records = records;
	}

	_FindRecordByID(id) {
		return this._records.find(elem => elem.id == id);
	}

	_ChangeHandler(e) {
		let record = this._FindRecordByID(e.target.selectedOptions[0].getAttribute("_record_id"));

		if(record) {
			let result_preprocessed = this._preprocessing.inference(record);
			if(result_preprocessed.error instanceof Error) {
				// --- error
			} else {
				if(result_preprocessed.Y > 0) {
					let original_Y = this._preprocessing.GetDateByY(record, result_preprocessed.Y);
					document.getElementById("duration_from_record").textContent = `${original_Y[0].getMonth() + 1} ${original_Y[0].getYear() + 1900}`;
				} else {
					document.getElementById("duration_from_record").textContent = ``;
				}

				let prediction = this._nn.predict(result_preprocessed.X);
				let predicted_Y = this._preprocessing.GetDateByY(record, prediction);
				document.getElementById("duration_from_inference").textContent = `${predicted_Y[0].getMonth() + 1} ${predicted_Y[0].getYear() + 1900}`;

			}
		} else {
			console.error("record not found");
		}
	}

	RenderUI() {
		let error = null;

		let select = document.createElement("select");
		select.setAttribute("multiple", "");
		select.setAttribute("id", "patients");
		select.setAttribute("size", `15`);
		select.addEventListener("change", this._ChangeHandler.bind(this));

		for (let i = this._records.length - 1; i >= 0; i--) {
			let record = this._records[i];

			let option = document.createElement("option");
			option.setAttribute("_record_id", `${record.id}`);
			option.text = `${record.___last_name} ${record.___first_name} ${record.___middle_name} (${record.___birthdate})`;

			select.appendChild(option);
		}

		return {dom: select, error: error};
	}

	AddToPage(dom, placeholder) {
		placeholder.appendChild(dom);
	}
	
}
