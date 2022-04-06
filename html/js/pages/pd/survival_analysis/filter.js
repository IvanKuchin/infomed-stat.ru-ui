export default class Filter {
	_records = [];
	_indices = [];
	_ref_dom;

	constructor(id, records, ref_dom) { 
		this.id = id; // --- forwards it to setter 

		this._records = records;
		this._indices = Array.from(Array(records.length).keys()); // --- initialize indices w/o filters

		this._ref_dom = ref_dom;

	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

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
		opt.appendChild(document.createTextNode(infomed_stat.GetMedicalItemNameSpelling(property)));

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
		arr.push(this._GetMedPropertyDOM("")); // first element should be empty, to denote "all" values

		for(const property in record) {
			if(this._IsMedProperty(property)) {
				arr.push(this._GetMedPropertyDOM(property));
			}
		}

		return arr;
	}

	// Builds array of options from records[indices].key
	// Input:
	//		record	- array of medical records
	//		indices - array of filtered indeces 
	//		key		- object field that provides values for HTML option tag
	_GetValuesOfMedicalRecordsAsOptionList(records, indices, key) {
		let arr = [];
		arr.push(this._GetOptionDOM("")); // first element should be empty, to denote "all" values

		for (var i = 0; i < indices.length; i++) {
			let	idx = indices[i];

			arr.push(this._GetOptionDOM(records[idx][key]))
		}

		return arr;
	}

	_Key_ChangeHandler(e) {
		let	values_tag	= e.target.closest("[placeholder]").querySelector("[values]");
		let option_list = this._GetValuesOfMedicalRecordsAsOptionList(this._records, this._indices, e.target.value);

		for (var i = 0; i < option_list.length; i++) {
			values_tag.appendChild(option_list[i]);
		}
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


		col				.appendChild(filter_key_div);
		col				.appendChild(filter_val_div);

		filter_key_div	.appendChild(filter_key_sel);		
		filter_val_div	.appendChild(filter_val_sel);		

		return col;
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
		panel_header_delete_button_icon.classList.add("glyphicon", "glyphicon-eye-close");
		// panel_header_delete_button_icon.addEventListener("click", this._ToggleDatasetVisibility_ClickHandler.bind(this));

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
		panel_header_hide_button		.appendChild(panel_header_delete_button_icon);
		panel_body						.appendChild(filter_row);
		filter_row						.appendChild(this._GetSelectsDOM());

		return wrapper;
	}

}
