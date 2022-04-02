export default class Dataset {
	_records = [];
	_indices = [];
	_filters = [];

	constructor(id, records, km) { 
		this.id = id; // --- forwards it to setter 

		this._records = records;
		this._indices = Array.from(Array(records.length).keys()); // --- initialize indices w/o filters

		this._km = km;
	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

	GetDOM() {
		let panel_wrapper_container = document.createElement("div");
		panel_wrapper_container.classList.add("container", "single_block", "box-shadow--6dp");

		let panel_wrapper_row = document.createElement("div");
		panel_wrapper_row.classList.add("row", "form-group");

		let panel_wrapper_col = document.createElement("div");
		panel_wrapper_col.classList.add("col", "col-xs-12");

		let panel = document.createElement("div");
		panel.setAttribute("dataset", this.id);
		panel.classList.add("panel", "panel-default")

		let panel_header = document.createElement("div");
		panel_header.classList.add("panel-heading");

		let panel_header_record_counter = document.createElement("span");
		panel_header_record_counter.setAttribute("record-counter", "");

		let panel_body = document.createElement("div");
		panel_body.classList.add("panel-body");

		let collapse = document.createElement("div");
		collapse.setAttribute("aria-expanded", true);
		collapse.classList.add("row", "collapse");

		let collapse_top_shadow = document.createElement("div");
		collapse_top_shadow.classList.add("col-xs-12", "collapse-top-shadow", "margin_bottom_20");
		collapse_top_shadow.appendChild(document.createElement("p"));

		let collapse_body_row = document.createElement("div");
		collapse_body_row.setAttribute("body", "");
		collapse_body_row.classList.add("row", "form-group");

		let collapse_body_col = document.createElement("div");
		collapse_body_col.classList.add("col-xs-12");

		let collapse_bottom_shadow = document.createElement("div");
		collapse_bottom_shadow.classList.add("col-xs-12", "collapse-bottom-shadow");
		collapse_bottom_shadow.appendChild(document.createElement("p"));

		panel					.appendChild(panel_header);
		panel					.appendChild(panel_body);
		panel_header			.appendChild(document.createTextNode("Группа " + this.id + ". Количество записей: "));
		panel_header			.appendChild(panel_header_record_counter);
		panel_body				.appendChild(collapse);
		collapse				.appendChild(collapse_top_shadow);
		collapse				.appendChild(collapse_body_row);
		collapse				.appendChild(collapse_bottom_shadow);
		collapse_body_row		.appendChild(collapse_body_col);


		return panel;
	}

	ToggleCollapsible() {
		$("[dataset='" + this.id + "'] .collapse").collapse("toggle");
	}

	AddToParent(parentDOM) {
		parentDOM.appendChild(this.GetDOM());
		this.ToggleCollapsible();

		this.Indices_ChangeHandler();
	}

	_GetEventCensorIndexes() {
		let censored_idxs = [];
		let event_idxs = [];

		for (let i = this._indices.length - 1; i >= 0; i--) {
			let record_id = this._indices[i];
			let retirement_date = this._records[record_id].___study_retirement_date;
			let death_date = this._records[record_id].___death_date;

			if(retirement_date.length) { censored_idxs.push(record_id); }
			if(death_date.length) { event_idxs.push(record_id); }
		}

		return {Event: event_idxs, Censored: censored_idxs};
	}

	_GetTimeDtCtOfEventCensor(indices) {

		console.debug("censoring:");
		for (var i = indices.Censored.length - 1; i >= 0; i--) {
			let record_id = indices.Censored[i];

			let neoadj_chemo_date = this._records[record_id].___neoadj_chemo___start_date;
			let invasion_date = this._records[record_id].___op_done___invasion_date;
			let adj_chemo_date = this._records[record_id].___adjuvant_chemotherapy_conduct___start_date;

			let censoring_date = this._records[record_id].___study_retirement_date;


			console.debug(record_id + ")", neoadj_chemo_date, "/", invasion_date, "/", adj_chemo_date, "->", censoring_date);
		}
	}

	CalculateKMSurvivalData() {
		let time = [];
		let number_at_risk = [];
		let number_of_death = [];
		let number_censored = [];
		let survival_probability = [];

		let temp_indices = this._GetEventCensorIndexes();
		let temp_time = this._GetTimeDtCtOfEventCensor(temp_indices);


		return {Time: time, Survival: survival_probability};
	}

	Indices_ChangeHandler() {
		let km_data = this.CalculateKMSurvivalData();
		document.querySelectorAll("[dataset='" + this._id + "'] [record-counter]")[0].innerText = this._indices.length;
		this._km.UpdateStepFunction();
	}
}
