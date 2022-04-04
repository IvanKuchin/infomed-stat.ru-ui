import Filter from "./filter.js"

export default class FilterGroup {
	_records = [];
	_indices = [];
	_filters = [];
	_ref_dom;

	constructor(id, records, ref_dom) { 
		this.id = id; // --- forwards it to setter 

		this._records = records;
		this._indices = Array.from(Array(records.length).keys()); // --- initialize indices w/o filters

		this._ref_dom = ref_dom;
	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

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
		panel_header_col1				.appendChild(document.createTextNode("Всего записей: "));
		panel_header_col1				.appendChild(panel_header_total_record_counter);
		panel_header_col1				.appendChild(document.createTextNode(". Событий: "));
		panel_header_col1				.appendChild(panel_header_event_record_counter);
		panel_header_col1				.appendChild(document.createTextNode(". Выбывших: "));
		panel_header_col1				.appendChild(panel_header_censored_record_counter);
		panel_header_col1				.appendChild(document.createTextNode(". Живых: "));
		panel_header_col1				.appendChild(panel_header_alive_record_counter);
		panel_header_col2				.appendChild(panel_header_hide_button);
		panel_header_hide_button		.appendChild(panel_header_delete_button_icon);
		panel_body						.appendChild(control_row);
		panel_body						.appendChild(filters_row);
		control_row						.appendChild(control_col);
		control_col						.appendChild(add_button);

		return wrapper;
	}

	_AddFilter_ClickHandler(e) {
		let new_id = this._filters.length;
		let ref_dom = this._ref_dom.querySelectorAll(`[filter-group="${this.id}"]`)[0];
		let filter = new Filter(new_id, this._records, ref_dom);
		this._filters.push(filter);

		ref_dom.querySelectorAll(`[placeholder]`)[0].appendChild(filter.GetDOM());
	}
}
