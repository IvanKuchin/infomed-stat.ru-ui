import Filter from "./filter.js"
import SaveToXLS from "../save2xls.js"

export default class FilterGroup {

	constructor(id, records, ref_dom, dataset_obj) { 
		this._records = [];
		this._filters = [];
		this._ref_dom = null;

		this.id = id; // --- forwards it to setter 

		this._records = records;
		this._dataset = dataset_obj; // --- used for metadata collection

		this._ref_dom = ref_dom;
	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

	get indices() { return this._indices; }
	set indices(idx) { this._indices = idx; }

	// Update filter GUI-metadata
	// Input:
	//		indices - array of indices to calculate metadata
	_UpdateMetadata(indices) {
		let dom_placeholder	= this._ref_dom.querySelector(`[filter-group="${this.id}"]`);
		let km_metadata		= this._dataset.GetKMMetadata(indices);

		dom_placeholder.querySelectorAll("[total-record-counter]")[0].innerText		= km_metadata.Total;
		dom_placeholder.querySelectorAll("[censored-record-counter]")[0].innerText	= km_metadata.Censored;
		dom_placeholder.querySelectorAll("[alive-record-counter]")[0].innerText		= km_metadata.Alive;
		dom_placeholder.querySelectorAll("[event-record-counter]")[0].innerText		= km_metadata.Events;
	}

	GetDOM() {
		let wrapper = document.createElement("div");
		wrapper.setAttribute("filter-group", this.id);
		wrapper.classList.add("col-xs-12");

		let panel = document.createElement("div");
		panel.classList.add("panel", "panel-default")

		let panel_header = document.createElement("div");
		panel_header.classList.add("panel-heading");

		let panel_header_row = document.createElement("div");
		panel_header_row.classList.add("row");

		let panel_header_col1 = document.createElement("div");
		panel_header_col1.classList.add("col-xs-10");

		let panel_header_col2 = document.createElement("div");
		panel_header_col2.classList.add("col-xs-2");

		let panel_header_total_record_counter = document.createElement("span");
		panel_header_total_record_counter.setAttribute("total-record-counter", "");

		let panel_header_censored_record_counter = document.createElement("span");
		panel_header_censored_record_counter.setAttribute("censored-record-counter", "");

		let panel_header_event_record_counter = document.createElement("span");
		panel_header_event_record_counter.setAttribute("event-record-counter", "");

		let panel_header_alive_record_counter = document.createElement("span");
		panel_header_alive_record_counter.setAttribute("alive-record-counter", "");

		let panel_header_collapse_button_icon = document.createElement("span");
		panel_header_collapse_button_icon.classList.add("glyphicon", "glyphicon-unchecked");

		let panel_header_hide_button = document.createElement("button");
		panel_header_hide_button.classList.add("btn", "btn_default", "float_right");

		let panel_header_delete_button_icon = document.createElement("span");
		panel_header_delete_button_icon.classList.add("glyphicon", "glyphicon", "glyphicon-remove-circle");
		panel_header_delete_button_icon.setAttribute("close", `${this.id}`);
		// panel_header_delete_button_icon.addEventListener("click", this._ToggleDatasetVisibility_ClickHandler.bind(this));

		let panel_header_download_button = document.createElement("span");
		panel_header_download_button.classList.add("btn", "btn_default", "float_right");
		panel_header_download_button.addEventListener("click", this._Download_ClickHandler.bind(this));

		let panel_header_download_button_icon = document.createElement("i");
		panel_header_download_button_icon.classList.add("fa", "fa-download");

		let panel_body = document.createElement("div");
		panel_body.classList.add("panel-body");

		let control_row = document.createElement("div");
		control_row.classList.add("row");

		let control_col = document.createElement("div");
		control_col.classList.add("col-xs-12", "form-group");

		let add_button = document.createElement("button");
		add_button.classList.add("btn", "btn-primary", "float_right");
		add_button.appendChild(document.createTextNode("+ фильтр"));
		add_button.addEventListener("click", this._AddFilter_ClickHandler.bind(this));

		let filters_row = document.createElement("div");
		filters_row.classList.add("row");
		filters_row.setAttribute("placeholder", "");

		wrapper							.appendChild(panel);
		panel							.appendChild(panel_header);
		panel							.appendChild(panel_body);
		panel_header					.appendChild(panel_header_row);
		panel_header_row				.appendChild(panel_header_col1);
		panel_header_row				.appendChild(panel_header_col2);
		panel_header_col1				.appendChild(document.createTextNode(`Группа фильтров: ${this.id}. Всего записей: `));
		panel_header_col1				.appendChild(panel_header_total_record_counter);
		panel_header_col1				.appendChild(document.createTextNode(". Событий: "));
		panel_header_col1				.appendChild(panel_header_event_record_counter);
		panel_header_col1				.appendChild(document.createTextNode(". Выбывших: "));
		panel_header_col1				.appendChild(panel_header_censored_record_counter);
		panel_header_col1				.appendChild(document.createTextNode(". Живых: "));
		panel_header_col1				.appendChild(panel_header_alive_record_counter);
		panel_header_col2				.appendChild(panel_header_hide_button);
		panel_header_col2				.appendChild(panel_header_download_button);
		panel_header_hide_button		.appendChild(panel_header_delete_button_icon);
		panel_header_download_button	.appendChild(panel_header_download_button_icon);
		panel_body						.appendChild(control_row);
		panel_body						.appendChild(filters_row);
		control_row						.appendChild(control_col);
		control_col						.appendChild(add_button);

		return wrapper;
	}

	_AddFilter_ClickHandler() {
		let new_id				= this._filters.length ? this._filters[this._filters.length - 1].id + 1 : 0;
		let pre_filter_indices	= (new_id ? this._filters[this._filters.length - 1].post_filter_indices : Array.from(Array(this._records.length).keys()));
		let filter				= new Filter(new_id, this._records, pre_filter_indices, this, this._dataset);
		this._filters.push(filter);

		let ref_dom				= this._ref_dom.querySelectorAll(`[filter-group="${this.id}"]`)[0];
		let	dom					= filter.GetDOM();
		ref_dom.querySelectorAll(`[placeholder]`)[0].appendChild(dom);
		dom.querySelector("[close]").addEventListener("click", this._RemoveFilter_ClickHandler.bind(this));

	}

	// Click handler to download filtered records
	// Input:  e		- Event
	// Output: none
	_Download_ClickHandler() {
		if(this._indices && this._indices.length)
		{
			// collect records filtered by indexes
			let records_to_save = this._indices.map(idx => this._records[parseInt(idx)]);

			let saver = new SaveToXLS();
			let save_result = saver.Do(records_to_save);

			if(save_result.error instanceof Error) {
				console.error(save_result.error);
			}
		} else {
			console.debug(`_indices array is empty`)	
		}
	}

	// Delete filter from filter_group[]
	// Input:
	//		filter_id - filter.id to delete
	_DeleteFilterFromArray(filter_id) {
		let filters = this._filters;
		let idx = this._GetFilterIdxByID(filter_id);

		filters.splice(idx, 1);

		if(filters.length) {
			// some filters still in the filter_group
			if(idx) {
				// Update filter.pre_filter_indices[] from previous post_filter
				this.FilterValue_Changed(filters[idx - 1].id);
			} else {
				// This will rebuild all indices
				filters[0].pre_filter_indices = Array.from(Array(this._records.length).keys());
				this._FireChangeEventInTheFilterKey(filters[0].id);
			}
		} else {
			// remove latest filter from the filter_group
			this._indices = [];
			this._UpdateMetadata(this._indices);
			this._dataset.Indices_ChangeHandler();
		}
	}

	// Remove filter from GUI and filters[]
	_RemoveFilter_ClickHandler(e) {
		let id = e.target.getAttribute("close");
		let tag = e.target.closest(`[remove="${id}"`);

		// Remove from GUI
		tag.remove();
		// Remove from data structures
		this._DeleteFilterFromArray(id);
	}

	// Find array index by filter.id
	// Input:
	//		filter.id - id to find
	// Output:
	//		index in the filters[]
	_GetFilterIdxByID(filter_id) {
		var i = 0;

		for (i = 0; i < this._filters.length; i++) {
			if(this._filters[i].id == filter_id) {
				break;
			}
		}

		return i;
	}

	// Returns true if filter_id is the last filter in filters[]
	// Input:
	//		filter_id - filter.id to check
	// Output:
	//		bool if filter is the last in the list
	_isLastInTheFiltersList(filter_id) {
		let filters = this._filters;

		return filters[filters.length - 1].id == filter_id
	}

	_FireChangeEventInTheFilterKey(filter_id) {
		let filter_dom = this._ref_dom.querySelector(`[filter-group="${this.id}"] [filter="${filter_id}"]`)
		system_calls.FireChangeEvent(filter_dom.querySelector("select[key]"));
	}

	// Function to call once filter values changed. It will trigger chain update to following filters
	// If filter is the last in filter-group, update filter-group metadata
	// If filter is not the last one, fire change-event in th next filter key field
	// Input:
	//		filter_id	- filter.id
	FilterValue_Changed(filter_id) {
		let idx = this._GetFilterIdxByID(filter_id);

		// if(filter_id == (this._filters.length - 1)) {
		if(this._isLastInTheFiltersList(filter_id)) {
			// update metadata
			this.indices = this._filters[idx].post_filter_indices;
			this._UpdateMetadata(this.indices);
			this._dataset.Indices_ChangeHandler();
		} else {
			let next_filter_id = this._filters[idx + 1].id;

			this._filters[idx + 1].pre_filter_indices = this._filters[idx].post_filter_indices;

			// fire change event in next filter key-field
			this._FireChangeEventInTheFilterKey(next_filter_id);
		}
	}
}
