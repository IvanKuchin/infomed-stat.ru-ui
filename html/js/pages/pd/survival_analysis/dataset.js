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

		let panel_header_total_record_counter = document.createElement("span");
		panel_header_total_record_counter.setAttribute("total-record-counter", "");

		let panel_header_censored_record_counter = document.createElement("span");
		panel_header_censored_record_counter.setAttribute("censored-record-counter", "");

		let panel_header_event_record_counter = document.createElement("span");
		panel_header_event_record_counter.setAttribute("event-record-counter", "");

		let panel_header_alive_record_counter = document.createElement("span");
		panel_header_alive_record_counter.setAttribute("alive-record-counter", "");

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
		panel_header			.appendChild(document.createTextNode("Группа " + this.id + ". Всего записей: "));
		panel_header			.appendChild(panel_header_total_record_counter);
		panel_header			.appendChild(document.createTextNode(". Событий: "));
		panel_header			.appendChild(panel_header_event_record_counter);
		panel_header			.appendChild(document.createTextNode(". Выбывших: "));
		panel_header			.appendChild(panel_header_censored_record_counter);
		panel_header			.appendChild(document.createTextNode(". Живых: "));
		panel_header			.appendChild(panel_header_alive_record_counter);
		panel_body				.appendChild(collapse);
		collapse				.appendChild(collapse_top_shadow);
		collapse				.appendChild(collapse_body_row);
		collapse				.appendChild(collapse_bottom_shadow);
		collapse_body_row		.appendChild(collapse_body_col);


		return panel;
	}

	_ToggleCollapsible() {
		$("[dataset='" + this.id + "'] .collapse").collapse("toggle");
	}

	AddToParent(parentDOM) {
		parentDOM.appendChild(this.GetDOM());
		this._ToggleCollapsible();

		this.Indices_ChangeHandler();
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

		if(isNaN(d1) && isNaN(d2) && isNaN(d3)) {
			error = new Error("no valid start date");
		} else if(isNaN(finish)) {
			error = new Error("no valid finish date");
		} else {
			let start = isNaN(d1) ? isNaN(d2) ? d3 : d2 : d1;

			months = (finish.getFullYear() - start.getFullYear()) * 12 - start.getMonth() + finish.getMonth();
		}

		return {error: error, months: months};
	}


	// Produces Event indices and Censor indices from indices(general) slice
	// Output: object with following items
	//			Event		- [] of record indexes with event happened
	//			Censored	- [] of record indexes with censoring happened
	//			Alive		- number of records that alive
	_GetEventCensorIndexes() {
		let censored_idxs = [];
		let event_idxs = [];
		let alive_idxs = [];

		for (let i = this._indices.length - 1; i >= 0; i--) {
			let record_idx = this._indices[i];
			let retirement_date = this._records[record_idx].___study_retirement_date;
			let death_date = this._records[record_idx].___death_date;

			if(retirement_date.length)	{ censored_idxs.push(record_idx); }
			else if(death_date.length)	{ event_idxs.push(record_idx); }
			else						{ alive_idxs.push(record_idx); }
		}

		return {Event: event_idxs, Censored: censored_idxs, Alive: alive_idxs};
	}

	// Produces Kaplan-Meier metadata 
	// Output: object
	//			Events		- number of events
	//			Censored	- number of censored
	//			Alive		- number of alive
	//			Total		- sum of all above
	_GetKMMetadata() {
		let obj	= this._GetEventCensorIndexes();

		return {
				Events:		obj.Event.length, 
				Censored:	obj.Censored.length, 
				Alive:		obj.Alive.length, 
				Total:		obj.Event.length + obj.Censored.length + obj.Alive.length,
			}; 
	}

	_GetBasicKMObject = function() {
		return {Censored: 0, Events: 0, Alive: 0, Patients: [] };
	}

	_GetPatientBriefObj = function(record, status) {
		return {
					first_name:		record.___first_name,
					last_name:		record.___last_name,
					middle_name:	record.___middle_name,
					birthdate:		record.___birthdate,
					status:			status,
				}
	}

	// Produces data "ready to be fit" to drawing app.
	// Input: Event indices and Censor indices
	// Output: sorted[] = Object{ Time: T, Censored: X, Events: Y }
	// 			Time		- time in months till censoring or event
	//			Censored	- number of events at this time
	//			Events		- number of events at this time
	_GetTimeDtCtOfEventCensor(indices_map) {
		let	km_map = new Map();

		for (var i = indices_map.Censored.length - 1; i >= 0; i--) {
			let record_idx = indices_map.Censored[i];

			let neoadj_chemo_date	= this._records[record_idx].___neoadj_chemo___start_date;
			let invasion_date		= this._records[record_idx].___op_done___invasion_date;
			let adj_chemo_date		= ""; // --- is not important

			let finish_date			= this._records[record_idx].___study_retirement_date;

			let time_map			= this._GetMonthsBetweenDates(neoadj_chemo_date, invasion_date, adj_chemo_date, finish_date);

			if(time_map.error instanceof Error) {
				console.error(`record id: ${this._records[record_idx].id}\n${time_map.error}`);
			} else {
				// console.debug(`${this._records[record_idx].id}) start(${neoadj_chemo_date} / ${invasion_date} / ${adj_chemo_date}) - finish(${finish_date}) -> ${time_map.months}`);

				let	time = time_map.months;
				if(km_map.has(time)) {
				} else {
					km_map.set(time, this._GetBasicKMObject());
				}

				km_map.get(time).Censored++;
				km_map.get(time).Patients.push(this._GetPatientBriefObj(this._records[record_idx], "выбыл"));
			}
		}


		for (var i = indices_map.Event.length - 1; i >= 0; i--) {
			let record_idx = indices_map.Event[i];

			let neoadj_chemo_date	= this._records[record_idx].___neoadj_chemo___start_date;
			let invasion_date		= this._records[record_idx].___op_done___invasion_date;
			let adj_chemo_date		= ""; // --- is not important

			let finish_date			= this._records[record_idx].___death_date;

			let time_map			= this._GetMonthsBetweenDates(neoadj_chemo_date, invasion_date, adj_chemo_date, finish_date);

			if(time_map.error instanceof Error) {
				console.error(`record id: ${this._records[record_idx].id}\n${time_map.error}`);
			} else {
				// console.debug(`${this._records[record_idx].id}) start(${neoadj_chemo_date} / ${invasion_date} / ${adj_chemo_date}) - finish(${finish_date}) -> ${time_map.months}`);

				let	time = time_map.months;
				if(km_map.has(time)) {
				} else {
					km_map.set(time, this._GetBasicKMObject());
				}
				km_map.get(time).Events++;
				km_map.get(time).Patients.push(this._GetPatientBriefObj(this._records[record_idx], "умер"));

			}
		}

		let now_date = new Date();
		let now_str = now_date.toISOString().slice(0, 10);
		for (var i = indices_map.Alive.length - 1; i >= 0; i--) {
			let record_idx = indices_map.Alive[i];

			let neoadj_chemo_date	= this._records[record_idx].___neoadj_chemo___start_date;
			let invasion_date		= this._records[record_idx].___op_done___invasion_date;
			let adj_chemo_date		= ""; // --- is not important

			let finish_date			= now_str;

			let time_map			= this._GetMonthsBetweenDates(neoadj_chemo_date, invasion_date, adj_chemo_date, finish_date);

			if(time_map.error instanceof Error) {
				console.error(`record id: ${this._records[record_idx].id}\n${time_map.error}`);
			} else {
				// console.debug(`${this._records[record_idx].id}) start(${neoadj_chemo_date} / ${invasion_date} / ${adj_chemo_date}) - finish(${finish_date}) -> ${time_map.months}`);

				let	time = time_map.months;
				if(km_map.has(time)) {
				} else {
					km_map.set(time, this._GetBasicKMObject());
				}
				km_map.get(time).Alive++;
				km_map.get(time).Patients.push(this._GetPatientBriefObj(this._records[record_idx], "жив"));
			}
		}

		// --- Convert map to array
		let km_arr = [{Time: 0, Censored: 0, Events: 0, Alive: 0, Patients: []}];
		km_map.forEach((v, k) => {
			km_arr.push({Time: k, Censored: v.Censored, Events: v.Events, Alive: v.Alive, Patients: v.Patients});
		})

		// --- Sort by Time
		let km_sorted = km_arr.sort((a, b) => a.Time - b.Time);

		return km_sorted;
	}

	_KMaddSurvival(km_base) {
		for (let i = km_base.length - 1; i >= 0; i--) {
			let cumulative_at_risk = (i < km_base.length - 1) ? km_base[i + 1].AtRisk : 0;
			km_base[i].AtRisk = km_base[i].Censored + km_base[i].Events + km_base[i].Alive + cumulative_at_risk;
		}

		km_base[0].Survival = 1;
		for (let i = 1; i < km_base.length; i++) {
			km_base[i].Survival = km_base[i - 1].Survival * (km_base[i].AtRisk - km_base[i].Events) / km_base[i].AtRisk;
		}

		return km_base;
	}

	_CalculateKMSurvivalData() {
		let indices_map		= this._GetEventCensorIndexes();
		let km_base			= this._GetTimeDtCtOfEventCensor(indices_map);
		let	km_survival		= this._KMaddSurvival(km_base);

		return km_survival;
	}

	Indices_ChangeHandler() {
		let km_metadata = this._GetKMMetadata();
		document.querySelectorAll("[dataset='" + this._id + "'] [total-record-counter]")[0].innerText = km_metadata.Total;
		document.querySelectorAll("[dataset='" + this._id + "'] [censored-record-counter]")[0].innerText = km_metadata.Censored;
		document.querySelectorAll("[dataset='" + this._id + "'] [alive-record-counter]")[0].innerText = km_metadata.Alive;
		document.querySelectorAll("[dataset='" + this._id + "'] [event-record-counter]")[0].innerText = km_metadata.Events;

		let km_data = this._CalculateKMSurvivalData();
		this._km.UpdateDataset(this.id, km_data);
		this._km.UpdateStepFunction();
	}
}
