import FilterGroup from "./filter-group.js"
import SaveToXLS from "../save2xls.js"

export default class Dataset {

	constructor(id, records, km, lr, or, coxph) {
		this._records = [];
		this._visibility = true;
		this._filter_groups = [];

		this.id = id; // --- forwards it to setter 

		this._records = records;

		this._km = km;
		this._lr = lr;
		this._or = or;
		this._coxph = coxph;
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

		let panel_header_row = document.createElement("div");
		panel_header_row.classList.add("row");

		let panel_header_col1 = document.createElement("div");
		panel_header_col1.classList.add("col-xs-10");

		let panel_header_col2 = document.createElement("div");
		panel_header_col2.classList.add("col-xs-2");

		let panel_header_metadata = document.createElement("div");
		panel_header_metadata.classList.add("form-group");

		let panel_header_total_record_counter = document.createElement("span");
		panel_header_total_record_counter.setAttribute("total-record-counter", "");

		let panel_header_censored_record_counter = document.createElement("span");
		panel_header_censored_record_counter.setAttribute("censored-record-counter", "");

		let panel_header_event_record_counter = document.createElement("span");
		panel_header_event_record_counter.setAttribute("event-record-counter", "");

		let panel_header_alive_record_counter = document.createElement("span");
		panel_header_alive_record_counter.setAttribute("alive-record-counter", "");

		let panel_header_collapse_button = document.createElement("button");
		panel_header_collapse_button.setAttribute("data-toggle", "collapse");
		panel_header_collapse_button.setAttribute("data-target", `[collapse-filters="${this.id}"]`);
		panel_header_collapse_button.classList.add("btn", "btn_default", "float_right");

		let panel_header_collapse_button_icon = document.createElement("span");
		panel_header_collapse_button_icon.classList.add("glyphicon", "glyphicon-unchecked");

		let panel_header_hide_button = document.createElement("button");
		panel_header_hide_button.classList.add("btn", "btn_default", "float_right");

		let panel_header_hide_button_icon = document.createElement("span");
		panel_header_hide_button_icon.classList.add("glyphicon", "glyphicon-eye-close");
		panel_header_hide_button_icon.addEventListener("click", this._ToggleDatasetVisibility_ClickHandler.bind(this));

		let panel_header_download_button = document.createElement("span");
		panel_header_download_button.classList.add("btn", "btn_default", "float_right");
		panel_header_download_button.addEventListener("click", this._Download_ClickHandler.bind(this));

		let panel_header_download_button_icon = document.createElement("i");
		panel_header_download_button_icon.classList.add("fa", "fa-download");

		let panel_body = document.createElement("div");
		panel_body.classList.add("panel-body");

		let collapse = document.createElement("div");
		collapse.setAttribute("aria-expanded", true);
		collapse.setAttribute("collapse-filters", this.id);
		collapse.classList.add("row", "collapse");

		let collapse_top_shadow = document.createElement("div");
		collapse_top_shadow.classList.add("col-xs-12", "collapse-top-shadow", "margin_bottom_20");
		collapse_top_shadow.appendChild(document.createElement("p"));

		let collapse_body = document.createElement("div");
		collapse_body.setAttribute("collapse-body", "");

		let collapse_bottom_buffer = document.createElement("div");
		collapse_bottom_buffer.classList.add("col-xs-12", "form-group");
		collapse_bottom_buffer.appendChild(document.createElement("p"));

		let collapse_bottom_shadow = document.createElement("div");
		collapse_bottom_shadow.classList.add("col-xs-12", "collapse-bottom-shadow");
		collapse_bottom_shadow.appendChild(document.createElement("p"));

		panel.appendChild(panel_header);
		panel.appendChild(panel_body);
		panel_header.appendChild(panel_header_row);
		panel_header_row.appendChild(panel_header_col1);
		panel_header_row.appendChild(panel_header_col2);
		panel_header_col1.appendChild(panel_header_metadata);
		panel_header_col1.appendChild(this._GetWarningDOM());
		panel_header_metadata.appendChild(document.createTextNode("График " + this.id + ". Всего записей: "));
		panel_header_metadata.appendChild(panel_header_total_record_counter);
		panel_header_metadata.appendChild(document.createTextNode(". Событий: "));
		panel_header_metadata.appendChild(panel_header_event_record_counter);
		panel_header_metadata.appendChild(document.createTextNode(". Выбывших: "));
		panel_header_metadata.appendChild(panel_header_censored_record_counter);
		panel_header_metadata.appendChild(document.createTextNode(". Живых: "));
		panel_header_metadata.appendChild(panel_header_alive_record_counter);
		panel_header_col2.appendChild(panel_header_hide_button);
		panel_header_col2.appendChild(panel_header_collapse_button);
		panel_header_col2.appendChild(panel_header_download_button);
		panel_header_collapse_button.appendChild(panel_header_collapse_button_icon);
		panel_header_hide_button.appendChild(panel_header_hide_button_icon);
		panel_header_download_button.appendChild(panel_header_download_button_icon);
		panel_body.appendChild(collapse);
		collapse.appendChild(collapse_top_shadow);
		collapse.appendChild(collapse_body);
		collapse.appendChild(collapse_bottom_buffer);
		collapse.appendChild(collapse_bottom_shadow);
		collapse_body.appendChild(this._GetDatasetControlDOM());

		return panel;
	}

	_GetWarningDOM() {
		let warning = document.createElement("div");
		warning.classList.add("alert", "alert-warning");
		warning.setAttribute("role", "alert");
		warning.setAttribute("logrank-warning", "");
		warning.setAttribute("hidden", "");

		warning.appendChild(document.createTextNode("LogRank вычисления требуют по крайней мере 30 записей."));

		return warning;
	}

	_GetDatasetControlDOM() {
		let wrapper = document.createElement("div");
		wrapper.classList.add("col-xs-12", "form-group");

		let row = document.createElement("div");
		row.classList.add("row");

		let col_date = document.createElement("div");
		col_date.classList.add("col-xs-6", "col-md-9");

		let col_button = document.createElement("div");
		col_button.classList.add("col-xs-6", "col-md-3");

		let now = new Date();
		let date_input = document.createElement("input");
		date_input.setAttribute("type", "date");
		date_input.setAttribute("call_date", "");
		date_input.addEventListener("change", this._CallDate_ChangeHandler.bind(this));
		date_input.value = now.toISOString().slice(0, 10);


		let filters_row_button = document.createElement("button");
		filters_row_button.classList.add("btn", "btn-primary", "float_right");
		filters_row_button.appendChild(document.createTextNode("+ группа фильтров"));
		filters_row_button.addEventListener("click", this._AddFilterGroup_ClickHandler.bind(this));

		let call_date_info = document.createElement("span");
		call_date_info.innerHTML = '&nbsp;<span class="fa fa-info-circle" onmouseover="system_calls.PopoverInfo($(this), \'используется для вычисления количества месяцев, которые живой пациет находится в исследовании\', true)"></span>';

		wrapper.appendChild(row);
		row.appendChild(col_date);
		row.appendChild(col_button);
		col_date.appendChild(document.createTextNode("Дата обзвона:"));
		col_date.appendChild(date_input);
		col_date.appendChild(call_date_info);
		col_button.appendChild(filters_row_button);


		return wrapper;
	}

	_ToggleCollapsible() {
		$("[dataset='" + this.id + "'] .collapse").collapse("toggle");
	}

	_CallDate_ChangeHandler() {
		console.debug("Call date: change handler");
		this.Indices_ChangeHandler();
	}

	_AddFilterGroup_ClickHandler() {
		let new_id = this._filter_groups.length ? this._filter_groups[this._filter_groups.length - 1].id + 1 : 0;
		let filter_group = new FilterGroup(new_id, this._records, document.querySelector(`[dataset="${this.id}"]`), this);
		this._filter_groups.push(filter_group);

		let dom = filter_group.GetDOM();
		document.querySelectorAll(`[dataset="${this.id}"] [collapse-body]`)[0].appendChild(dom);
		dom.querySelector("[close]").addEventListener("click", this._RemoveFilterGroup_ClickHandler.bind(this));
	}

	// Delete dataset with id == id from datasets[]
	// Input:
	//		id - dataset.id to be deleted
	_RemoveFilterGroupFromArray(id) {
		let filter_groups = this._filter_groups;

		for (var i = 0; i < filter_groups.length; i++) {
			if (filter_groups[i].id == id) {
				filter_groups.splice(i, 1);
				break;
			}
		}
	}

	// Remove filter-group from GUI and filters[]
	_RemoveFilterGroup_ClickHandler(e) {
		let id = e.target.getAttribute("close");
		let tag = e.target.closest(`[filter-group="${id}"`);

		tag.remove();
		this._RemoveFilterGroupFromArray(id);

		this.Indices_ChangeHandler();
	}

	AddToParent(parentDOM) {
		parentDOM.appendChild(this.GetDOM());
		this._ToggleCollapsible();

		// this.Indices_ChangeHandler();
	}

	// Calculate number of months between start dates and finish date
	//		start dates sorted in order of priority
	//		start1 - most priority
	//		start2 - medium
	//		start3 - least
	_GetMonthsBetweenDates(start1, start2, start3, _finish) {
		let error = "";
		let months = 0;

		let d1 = new Date(start1);
		let d2 = new Date(start2);
		let d3 = new Date(start3);
		let finish = new Date(_finish)

		if (isNaN(d1) && isNaN(d2) && isNaN(d3)) {
			error = new Error("no valid start date");
		} else if (isNaN(finish)) {
			error = new Error("no valid finish date");
		} else {
			let start = isNaN(d1) ? isNaN(d2) ? d3 : d2 : d1;

			months = (finish.getFullYear() - start.getFullYear()) * 12 - start.getMonth() + finish.getMonth();
		}

		if (months < 0) {
			error = new Error(`time frame is negative(${months})`)
		}

		return { error: error, months: months };
	}


	// Produces Event indices and Censor indices from indices(general) slice
	// Input:   indexes     - array of indexes pointing to records[]
	// Output: object with following items
	//			Event		- [] of record indexes with event happened
	//			Censored	- [] of record indexes with censoring happened
	//			Alive		- number of records that alive
	_GetEventCensorIndexes(indexes) {
		let censored_idxs = [];
		let event_idxs = [];
		let alive_idxs = [];

		for (let i = indexes.length - 1; i >= 0; i--) {
			let record_idx = indexes[i];
			let retirement_date = this._records[record_idx].___study_retirement_date;
			let death_date = this._records[record_idx].___death_date;

			if (retirement_date.length) { censored_idxs.push(record_idx); }
			else if (death_date.length) { event_idxs.push(record_idx); }
			else { alive_idxs.push(record_idx); }
		}

		return { Event: event_idxs, Censored: censored_idxs, Alive: alive_idxs };
	}

	// Produces Kaplan-Meier metadata 
	// Input:   indexes     - array of indexes pointing to records[]
	// Output: object
	//			Events		- number of events
	//			Censored	- number of censored
	//			Alive		- number of alive
	//			Total		- sum of all above
	GetKMMetadata(indexes) {
		let obj = this._GetEventCensorIndexes(indexes);

		return {
			Events: obj.Event.length,
			Censored: obj.Censored.length,
			Alive: obj.Alive.length,
			Total: obj.Event.length + obj.Censored.length + obj.Alive.length,
		};
	}

	_GetBasicKMObject() {
		return { Censored: 0, Events: 0, Alive: 0, Patients: [] };
	}

	_GetPatientBriefObj(record, status) {
		return {
			first_name: record.___first_name,
			last_name: record.___last_name,
			middle_name: record.___middle_name,
			birthdate: record.___birthdate,
			status: status,
		}
	}

	// Produces data "ready to be fit" to drawing app.
	// Input: Event indices and Censor indices
	// Output: sorted[] = Object{ Time: T, Censored: X, Events: Y }
	// 			Time		- time in months till censoring or event
	//			Censored	- number of events at this time
	//			Events		- number of events at this time
	_GetTimeDtCtOfEventCensor(indices_map, call_date) {
		let km_map = new Map();

		for (let i = indices_map.Censored.length - 1; i >= 0; i--) {
			let record_idx = indices_map.Censored[i];

			let neoadj_chemo_date = this._records[record_idx].___neoadj_chemo___start_date;
			let invasion_date = this._records[record_idx].___op_done___invasion_date;
			let adj_chemo_date = ""; // --- is not important

			let finish_date = this._records[record_idx].___study_retirement_date;

			let time_map = this._GetMonthsBetweenDates(neoadj_chemo_date, invasion_date, adj_chemo_date, finish_date);

			if (time_map.error instanceof Error) {
				console.error(`record id: ${this._records[record_idx].id}\n${time_map.error}`);
			} else {
				// console.debug(`${this._records[record_idx].id}) start(${neoadj_chemo_date} / ${invasion_date} / ${adj_chemo_date}) - finish(${finish_date}) -> ${time_map.months}`);

				let time = time_map.months;
				if (km_map.has(time)) {
					// --- ok
				} else {
					km_map.set(time, this._GetBasicKMObject());
				}

				km_map.get(time).Censored++;
				km_map.get(time).Patients.push(this._GetPatientBriefObj(this._records[record_idx], "выбыл"));
			}
		}


		for (let i = indices_map.Event.length - 1; i >= 0; i--) {
			let record_idx = indices_map.Event[i];

			let neoadj_chemo_date = this._records[record_idx].___neoadj_chemo___start_date;
			let invasion_date = this._records[record_idx].___op_done___invasion_date;
			let adj_chemo_date = ""; // --- is not important

			let finish_date = this._records[record_idx].___death_date;

			let time_map = this._GetMonthsBetweenDates(neoadj_chemo_date, invasion_date, adj_chemo_date, finish_date);

			if (time_map.error instanceof Error) {
				console.error(`record id: ${this._records[record_idx].id}\n${time_map.error}`);
			} else {
				// console.debug(`${this._records[record_idx].id}) start(${neoadj_chemo_date} / ${invasion_date} / ${adj_chemo_date}) - finish(${finish_date}) -> ${time_map.months}`);

				let time = time_map.months;
				if (km_map.has(time)) {
					/// --- ok
				} else {
					km_map.set(time, this._GetBasicKMObject());
				}
				km_map.get(time).Events++;
				km_map.get(time).Patients.push(this._GetPatientBriefObj(this._records[record_idx], "умер"));

			}
		}

		// let now_date = new Date();
		// let now_str = now_date.toISOString().slice(0, 10);
		for (let i = indices_map.Alive.length - 1; i >= 0; i--) {
			let record_idx = indices_map.Alive[i];

			let neoadj_chemo_date = this._records[record_idx].___neoadj_chemo___start_date;
			let invasion_date = this._records[record_idx].___op_done___invasion_date;
			let adj_chemo_date = ""; // --- is not important

			// let finish_date			= now_str;
			let finish_date = call_date;


			let time_map = this._GetMonthsBetweenDates(neoadj_chemo_date, invasion_date, adj_chemo_date, finish_date);

			if (time_map.error instanceof Error) {
				console.error(`record id: ${this._records[record_idx].id}\n${time_map.error}`);
			} else {
				// console.debug(`${this._records[record_idx].id}) start(${neoadj_chemo_date} / ${invasion_date} / ${adj_chemo_date}) - finish(${finish_date}) -> ${time_map.months}`);

				let time = time_map.months;
				if (km_map.has(time)) {
					/// --- ok
				} else {
					km_map.set(time, this._GetBasicKMObject());
				}
				km_map.get(time).Alive++;
				km_map.get(time).Patients.push(this._GetPatientBriefObj(this._records[record_idx], "жив"));
			}
		}

		// --- Convert map to array
		let km_arr = [{ Time: 0, Censored: 0, Events: 0, Alive: 0, Patients: [] }];
		km_map.forEach((v, k) => {
			km_arr.push({ Time: k, Censored: v.Censored, Events: v.Events, Alive: v.Alive, Patients: v.Patients });
		})

		// --- Sort by Time
		let km_sorted = km_arr.sort((a, b) => a.Time - b.Time);

		return km_sorted;
	}

	// Add KM-specific data
	_KMaddSurvival(km_base) {

		// Walk over table from the bottom to the top to calculate cumulative at risk numbers
		for (let i = km_base.length - 1; i >= 0; i--) {
			let cumulative_at_risk = (i < km_base.length - 1) ? km_base[i + 1].AtRisk : 0;
			km_base[i].AtRisk = km_base[i].Censored + km_base[i].Events + km_base[i].Alive + cumulative_at_risk;
		}

		// Walk over table from the top to the bottom to calculate survival rate 
		km_base[0].Survival = 1;
		for (let i = 1; i < km_base.length; i++) {
			km_base[i].Survival = km_base[i - 1].Survival * (km_base[i].AtRisk - km_base[i].Events) / km_base[i].AtRisk;
		}

		return km_base;
	}

	// Calculates full KM data from provided indexes
	// Input:   indexes     - array of indexes pointing to records[]
	// Output:	object
	// 			Time		- time in months till censoring or event
	//			Censored	- number of events at this time
	//			Events		- number of events at this time
	//			Alive		- number of alive at this time
	//			Patients	- list of all patients at timestamp
	_CalculateKMSurvivalData(indexes, call_date) {
		let indices_map = this._GetEventCensorIndexes(indexes);
		let km_base = this._GetTimeDtCtOfEventCensor(indices_map, call_date);
		let km_survival = this._KMaddSurvival(km_base);

		return km_survival;
	}

	_ToggleDatasetVisibility_ClickHandler() {
		this._visibility = !this._visibility;

		if (this._visibility) {
			this.Indices_ChangeHandler();
		} else {
			this._km.RemoveDataset(this.id);
			this._km.UpdateUI();

			this._lr.RemoveDataset(this.id);
			this._lr.UpdateUI();

			this._or.RemoveDataset(this.id);
			this._or.UpdateUI();

			this._coxph.RemoveDataset(this.id);
			this._coxph.UpdateUI();
		}
	}

	_GetIndicesFromDatasets(filter_groups) {
		let indices = [];

		for (let i = 0; i < filter_groups.length; i++) {
			if (filter_groups[i].indices) {
				indices = indices.concat(filter_groups[i].indices);
			}
		}

		let map = new Map();
		for (var i = 0; i < indices.length; i++) {
			map.set(indices[i], "");
		}

		return Array.from(map.keys());
	}

	_ShowHideLogRankWarning(number_of_records) {
		let tag = document.querySelectorAll("[dataset='" + this._id + "'] [logrank-warning]")[0];

		if (isNaN(number_of_records)) {
			tag.setAttribute("hidden", "");
		} else {
			if (number_of_records >= 30) {
				tag.setAttribute("hidden", "");
			} else {
				tag.removeAttribute("hidden");
			}

		}
	}

	// Calculate Log Rank data based on Kaplan Meier data
	// Input:
	//		data - KM data
	// Output:
	//		array of LogRank data
	_CalculateLogRank(data) {
		return data;
	}

	_ConvertKMToCox(data) {
		let T = [];
		let E = [];

		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].Events; j++) {
				T.push(data[i].Time);
				E.push(1);
			}
			for (let j = 0; j < data[i].Censored; j++) {
				T.push(data[i].Time);
				E.push(0);
			}
		}

		return { T: T, E: E };
	}

	Indices_ChangeHandler() {
		let indices = this._GetIndicesFromDatasets(this._filter_groups);

		let km_metadata = this.GetKMMetadata(indices);
		document.querySelectorAll("[dataset='" + this._id + "'] [total-record-counter]")[0].innerText = km_metadata.Total;
		document.querySelectorAll("[dataset='" + this._id + "'] [censored-record-counter]")[0].innerText = km_metadata.Censored;
		document.querySelectorAll("[dataset='" + this._id + "'] [alive-record-counter]")[0].innerText = km_metadata.Alive;
		document.querySelectorAll("[dataset='" + this._id + "'] [event-record-counter]")[0].innerText = km_metadata.Events;

		this._ShowHideLogRankWarning(km_metadata.Total);

		let welfare_check_date = document.querySelectorAll("[dataset='" + this._id + "'] [call_date]")[0].value
		let km_data = this._CalculateKMSurvivalData(indices, welfare_check_date);
		this._km.UpdateDataset(this.id, km_data);
		this._km.UpdateUI();

		let log_rank = this._CalculateLogRank(km_data);
		this._lr.UpdateDataset(this.id, log_rank);
		this._lr.UpdateUI();

		this._or.UpdateDataset(this.id, km_data);
		this._or.UpdateUI();

		let cox_data = this._ConvertKMToCox(km_data);
		this._coxph.UpdateDataset(this.id, cox_data);
		this._coxph.UpdateUI();
	}

	// Click handler to download filtered records
	// Input:  e		- Event
	// Output: none
	_Download_ClickHandler() {
		let indices = this._GetIndicesFromDatasets(this._filter_groups);

		if (indices && indices.length) {
			// collect records filtered by indexes
			let records_to_save = indices.map(idx => this._records[parseInt(idx)]);

			let saver = new SaveToXLS();
			let save_result = saver.Do(records_to_save);

			if (save_result.error instanceof Error) {
				console.error(save_result.error);
			}
		} else {
			console.debug(`indices array is empty`)
		}
	}
}
