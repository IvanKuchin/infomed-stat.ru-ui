import SaveToXLS from "../save2xls.js"

export default class Filter {


	// Constructor
	// Input:
	//		id				- filter.id (set by filter-group, IMPORTANT !!! always sequential)
	//		records			- medical records
	//		filter_group	- reference to the parent filter-group object, will be used to notify parent object if this filter been changed
	//		dataset_obj		- reference to parent dataset object, it will be used to get KM-metadata
	constructor(id, records, pre_filter_indices, filter_group, dataset_obj) { 
		this._records = [];
		this._pre_filter_indices = [];
		this._post_filter_indices = [];
		this._filter_group = null;
		this._dataset = null;

		this.id = id; // --- forwards it to setter 

		this._records = records;
		this._pre_filter_indices = pre_filter_indices; // --- initialize indices w/o filters
		this._dataset = dataset_obj; // --- used for metadata collection


		this._filter_group = filter_group;

	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

	get post_filter_indices() { return this._post_filter_indices; }
	set pre_filter_indices(indices) { this._pre_filter_indices = indices; }


	_IsMedProperty(property) {
		return property.indexOf("___") == 0 ? true : false;
	}

	// Build HTML-option tag. Values taken from translation of medical record keys to local language
	// Input:
	//		property	- medical record key
	// Output:
	//		HTML option tag
	_GetMedPropertyDOM(property) {
		let opt = document.createElement("option");
		opt.setAttribute("value", property);
		opt.appendChild(document.createTextNode(common_infomed_stat.GetMedicalItemNameSpelling(property)));

		return opt;
	}

	// Build HTML-option tag. Values taken from parameter
	// Input:
	//		value - Option value
	// Output:
	//		HTML option tag
	_GetOptionDOM(value) {
		let opt = document.createElement("option");
		opt.setAttribute("value", value);
		opt.appendChild(document.createTextNode(value));

		return opt;
	}


	// Builds array of HTML-options with names/values build from medical records keys
	// Input:
	//		record - object contains all fields that filter coul be applied to
	// Output:
	//		array of HTML option tags with proper values
	_GetMedicalNamesAsOptionList(record) {
		let arr = [];

		for(const property in record) {
			if(this._IsMedProperty(property)) {
				arr.push(this._GetMedPropertyDOM(property));
			}
		}

		return arr;
	}


	// Builds array of unique values from records[indices][key]
	// Input:
	//		record	- array of medical records
	//		indices - array of filtered indices 
	//		key		- object field that provides values for HTML option tag
	// Output:
	//		array of uniq values
	_GetUniqueValues(records, indices, key) {
		let unique_values_map = new Map();
		let unique_values_array = [];

		for (let i = 0; i < indices.length; i++) {
			let idx = indices[i];
			unique_values_map.set(records[idx][key]);
		}

		for (let key of unique_values_map.keys()) {
			unique_values_array.push(key);
		}

		return unique_values_array.sort();
	}

	// Builds array of options from records[indices].key
	// Input:
	//		record	- array of medical records
	//		indices - array of filtered indices 
	//		key		- object field that provides values for HTML option tag
	_GetValuesOfMedicalRecordsAsOptionList(records, indices, key) {
		let arr				= [];
		let unique_values	= this._GetUniqueValues(records, indices, key);

		for (let i = 0; i < unique_values.length; i++) {
			arr.push(this._GetOptionDOM(unique_values[i]))
		}

		return arr;
	}

	_Key_ChangeHandler(e) {
		let	filter_val_sel	= e.target.closest("[placeholder]").querySelector("[values]");
		let option_list = this._GetValuesOfMedicalRecordsAsOptionList(this._records, this._pre_filter_indices, e.target.value);

		filter_val_sel.innerHTML = "";
		for (var i = 0; i < option_list.length; i++) {
			option_list[i].selected = "selected";
			filter_val_sel.appendChild(option_list[i]);
		}

		system_calls.FireChangeEvent(filter_val_sel);
	}

	// Returns array of values collected from multiple selected options
	// Input:
	//		select_tag - <SELECT>
	// Output:
	//		array of values from selected options
	_GetSelectedOptionsValues(select_tag) {
		return Array.from(select_tag.selectedOptions).map(tag => tag.value);
	}

	// Update filter GUI-metadata
	// Input:
	//		indices - array of indices to calculate metadata
	//		dom_placeholder - place in the DOM where to start searching for metadata
	_UpdateMetadata(indices, dom_placeholder) {
		let km_metadata = this._dataset.GetKMMetadata(indices);

		dom_placeholder.querySelectorAll("[total-record-counter]")[0].innerText		= km_metadata.Total;
		dom_placeholder.querySelectorAll("[censored-record-counter]")[0].innerText	= km_metadata.Censored;
		dom_placeholder.querySelectorAll("[alive-record-counter]")[0].innerText		= km_metadata.Alive;
		dom_placeholder.querySelectorAll("[event-record-counter]")[0].innerText		= km_metadata.Events;
	}


	// Event handler, handles "change" events happened in "value"-<SELECT>
	// Input:
	//		e - event object
	_Val_ChangeHandler(e) {
		let selected_values = this._GetSelectedOptionsValues(e.target);
		let	key_select_tag	= e.target.closest("[placeholder]").querySelectorAll("select[key]")[0];
		let key				= key_select_tag.value;

		this._post_filter_indices = [];
		for (let i = 0; i < this._pre_filter_indices.length; i++) {
			let idx = this._pre_filter_indices[i];

			if(selected_values.includes(this._records[idx][key])) {
				this._post_filter_indices.push(idx);
			}
		}

		// console.debug(`pre-filter ${this.id}: ${this._pre_filter_indices}`);
		// console.debug(`post-filter ${this.id}: ${this._post_filter_indices}`);

		this._UpdateMetadata(this._post_filter_indices, e.target.closest(".panel"));

		this._filter_group.FilterValue_Changed(this.id);
	}

	_GetSelectsDOM() {
		let col = document.createElement("div");
		col.classList.add("col-xs-12");
		col.setAttribute("filter", `${this.id}`)
		col.setAttribute("placeholder", "")

		let filter_key_div = document.createElement("div");
		filter_key_div.classList.add("form-group");
		let filter_key_sel = document.createElement("select");
		filter_key_sel.setAttribute("key", "");

		let option_list = this._GetMedicalNamesAsOptionList(this._records[0]);
		for (var i = 0; i < option_list.length; i++) {
			filter_key_sel.appendChild(option_list[i]);
		}
		filter_key_sel.addEventListener("change", this._Key_ChangeHandler.bind(this));

		let filter_val_div = document.createElement("div");
		let filter_val_sel = document.createElement("select");
		filter_val_sel.setAttribute("values", "");
		filter_val_sel.setAttribute("multiple", "");
		filter_val_sel.setAttribute("size", "10");
		filter_val_sel.classList.add("form-group");
		filter_val_sel.addEventListener("change", this._Val_ChangeHandler.bind(this));


		col				.appendChild(filter_key_div);
		col				.appendChild(filter_val_div);

		filter_key_div	.appendChild(filter_key_sel);		
		filter_val_div	.appendChild(filter_val_sel);		

		return col;
	}

	GetDOM() {
		let wrapper = document.createElement("div");
		wrapper.classList.add("col-xs-12");
		wrapper.setAttribute("remove", this.id);

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
		panel_header_delete_button_icon.classList.add("glyphicon", "glyphicon-remove-circle");
		panel_header_delete_button_icon.setAttribute("close", `${this.id}`);

		let panel_header_download_button = document.createElement("span");
		panel_header_download_button.classList.add("btn", "btn_default", "float_right");
		panel_header_download_button.addEventListener("click", this._Download_ClickHandler.bind(this));

		let panel_header_download_button_icon = document.createElement("i");
		panel_header_download_button_icon.classList.add("fa", "fa-download");

		let panel_body = document.createElement("div");
		panel_body.classList.add("panel-body");

		let filter_row = document.createElement("div");
		filter_row.classList.add("row");

		wrapper							.appendChild(panel);
		panel							.appendChild(panel_header);
		panel							.appendChild(panel_body);
		panel_header					.appendChild(panel_header_row);
		panel_header_row				.appendChild(panel_header_col1);
		panel_header_row				.appendChild(panel_header_col2);
		panel_header_col1				.appendChild(document.createTextNode(`Фильтр: ${this.id}. Всего записей: `));
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
		panel_body						.appendChild(filter_row);
		filter_row						.appendChild(this._GetSelectsDOM());

		system_calls.FireChangeEvent(panel.querySelector("select[key]"));

		return wrapper;
	}

	// Click handler to download filtered records
	// Input:  e		- Event
	// Output: none
	_Download_ClickHandler() {
		if(this._post_filter_indices && this._post_filter_indices.length)
		{
			// collect records filtered by indexes
			let records_to_save = this._post_filter_indices.map(idx => this._records[parseInt(idx)]);

			let saver = new SaveToXLS();
			let save_result = saver.Do(records_to_save);

			if(save_result.error instanceof Error) {
				console.error(save_result.error);
			}
		} else {
			console.debug(`_post_filter_indices array is empty`)	
		}
	}
}
