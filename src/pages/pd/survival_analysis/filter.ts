import SaveToXLS from "../save2xls.js"

// Define types for medical records and dataset object
interface MedicalRecord {
	[key: string]: any;
}

interface FilterGroup {
	FilterValue_Changed(id: number): void;
}

interface Dataset {
	GetKMMetadata(indices: number[]): {
		Total: number;
		Censored: number;
		Alive: number;
		Events: number;
	};
}

declare const common_infomed_stat: {
	GetMedicalItemNameSpelling(property: string): string;
};
declare const system_calls: {
	FireChangeEvent(element: Element): void;
};

export default class Filter {
	private _records: MedicalRecord[];
	private _pre_filter_indices: number[];
	private _post_filter_indices: number[];
	private _filter_group: FilterGroup | null;
	private _dataset: Dataset | null;
	private _id!: number;

	// Constructor
	// Input:
	//		id				- filter.id (set by filter-group, IMPORTANT !!! always sequential)
	//		records			- medical records
	//		filter_group	- reference to the parent filter-group object, will be used to notify parent object if this filter been changed
	//		dataset_obj		- reference to parent dataset object, it will be used to get KM-metadata
	constructor(
		id: number,
		records: MedicalRecord[],
		pre_filter_indices: number[],
		filter_group: FilterGroup,
		dataset_obj: Dataset
	) {
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

	get id(): number { return this._id; }
	set id(id: number) { this._id = id; }

	get post_filter_indices(): number[] { return this._post_filter_indices; }
	set pre_filter_indices(indices: number[]) { this._pre_filter_indices = indices; }

	private _IsMedProperty(property: string): boolean {
		return property.indexOf("___") == 0 ? true : false;
	}

	private _GetMedPropertyDOM(property: string): HTMLOptionElement {
		let opt = document.createElement("option");
		opt.setAttribute("value", property);
		opt.appendChild(document.createTextNode(common_infomed_stat.GetMedicalItemNameSpelling(property)));
		return opt;
	}

	private _GetOptionDOM(value: string): HTMLOptionElement {
		let opt = document.createElement("option");
		opt.setAttribute("value", value);
		opt.appendChild(document.createTextNode(value));
		return opt;
	}

	private _GetMedicalNamesAsOptionList(record: MedicalRecord): HTMLOptionElement[] {
		let arr: HTMLOptionElement[] = [];
		for (const property in record) {
			if (this._IsMedProperty(property)) {
				arr.push(this._GetMedPropertyDOM(property));
			}
		}
		return arr;
	}

	private _GetUniqueValues(records: MedicalRecord[], indices: number[], key: string): string[] {
		let unique_values_map = new Map<string, boolean>();
		let unique_values_array: string[] = [];
		for (let i = 0; i < indices.length; i++) {
			let idx = indices[i];
			unique_values_map.set(records[idx][key], true);
		}
		for (let key of unique_values_map.keys()) {
			unique_values_array.push(key);
		}
		return unique_values_array.sort();
	}

	private _GetValuesOfMedicalRecordsAsOptionList(records: MedicalRecord[], indices: number[], key: string): HTMLOptionElement[] {
		let arr: HTMLOptionElement[] = [];
		let unique_values = this._GetUniqueValues(records, indices, key);
		for (let i = 0; i < unique_values.length; i++) {
			arr.push(this._GetOptionDOM(unique_values[i]))
		}
		return arr;
	}

	private _Key_ChangeHandler(e: Event): void {
		const target = e.target as HTMLElement;
		let filter_val_sel = target.closest("[placeholder]")!.querySelector("[values]") as HTMLSelectElement;
		let option_list = this._GetValuesOfMedicalRecordsAsOptionList(this._records, this._pre_filter_indices, (target as HTMLSelectElement).value);
		filter_val_sel.innerHTML = "";
		for (var i = 0; i < option_list.length; i++) {
			option_list[i].selected = true;
			filter_val_sel.appendChild(option_list[i]);
		}
		system_calls.FireChangeEvent(filter_val_sel);
	}

	private _GetSelectedOptionsValues(select_tag: HTMLSelectElement): string[] {
		return Array.from(select_tag.selectedOptions).map(tag => tag.value);
	}

	private _UpdateMetadata(indices: number[], dom_placeholder: Element): void {
		if (!this._dataset) return;
		let km_metadata = this._dataset.GetKMMetadata(indices);
		dom_placeholder.querySelectorAll("[total-record-counter]")[0].textContent = String(km_metadata.Total);
		dom_placeholder.querySelectorAll("[censored-record-counter]")[0].textContent = String(km_metadata.Censored);
		dom_placeholder.querySelectorAll("[alive-record-counter]")[0].textContent = String(km_metadata.Alive);
		dom_placeholder.querySelectorAll("[event-record-counter]")[0].textContent = String(km_metadata.Events);
	}

	private _Val_ChangeHandler(e: Event): void {
		const target = e.target as HTMLSelectElement;
		let selected_values = this._GetSelectedOptionsValues(target);
		let key_select_tag = target.closest("[placeholder]")!.querySelectorAll("select[key]")[0] as HTMLSelectElement;
		let key = key_select_tag.value;
		this._post_filter_indices = [];
		for (let i = 0; i < this._pre_filter_indices.length; i++) {
			let idx = this._pre_filter_indices[i];
			if (selected_values.indexOf(this._records[idx][key]) !== -1) {
				this._post_filter_indices.push(idx);
			}
		}
		this._UpdateMetadata(this._post_filter_indices, target.closest(".panel")!);
		if (this._filter_group) {
			this._filter_group.FilterValue_Changed(this.id);
		}
	}

	private _GetSelectsDOM(): HTMLDivElement {
		let col = document.createElement("div");
		col.classList.add("col-xs-12");
		col.setAttribute("filter", `${this.id}`)
		col.setAttribute("placeholder", "")
		col.addEventListener("update_metadata", this._updateMetadata_Handler.bind(this));

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
		col.appendChild(filter_key_div);
		col.appendChild(filter_val_div);
		filter_key_div.appendChild(filter_key_sel);
		filter_val_div.appendChild(filter_val_sel);
		return col;
	}

	public GetDOM(): HTMLDivElement {
		let wrapper = document.createElement("div");
		wrapper.classList.add("col-xs-12");
		wrapper.setAttribute("remove", String(this.id));

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
		wrapper.appendChild(panel);
		panel.appendChild(panel_header);
		panel.appendChild(panel_body);
		panel_header.appendChild(panel_header_row);
		panel_header_row.appendChild(panel_header_col1);
		panel_header_row.appendChild(panel_header_col2);
		panel_header_col1.appendChild(document.createTextNode(`Фильтр: ${this.id}. Всего записей: `));
		panel_header_col1.appendChild(panel_header_total_record_counter);
		panel_header_col1.appendChild(document.createTextNode(". Событий: "));
		panel_header_col1.appendChild(panel_header_event_record_counter);
		panel_header_col1.appendChild(document.createTextNode(". Выбывших: "));
		panel_header_col1.appendChild(panel_header_censored_record_counter);
		panel_header_col1.appendChild(document.createTextNode(". Живых: "));
		panel_header_col1.appendChild(panel_header_alive_record_counter);
		panel_header_col2.appendChild(panel_header_hide_button);
		panel_header_col2.appendChild(panel_header_download_button);
		panel_header_hide_button.appendChild(panel_header_delete_button_icon);
		panel_header_download_button.appendChild(panel_header_download_button_icon);
		panel_body.appendChild(filter_row);
		filter_row.appendChild(this._GetSelectsDOM());
		const keySelect = panel.querySelector("select[key]");
		if (keySelect) {
			system_calls.FireChangeEvent(keySelect);
		}
		return wrapper;
	}

	private _Download_ClickHandler(): void {
		if (this._post_filter_indices && this._post_filter_indices.length) {
			let records_to_save = this._post_filter_indices.map(idx => this._records[parseInt(String(idx))]);
			let saver = new SaveToXLS();
			let save_result = saver.Do(records_to_save);
			if (save_result.error instanceof Error) {
				console.error(save_result.error);
			}
		} else {
			console.debug(`_post_filter_indices array is empty`)
		}
	}

	private _updateMetadata_Handler(e: Event): void {
		const target = e.target as HTMLElement;
		let panel_dom = target.closest(".panel");
		if (panel_dom) {
			this._UpdateMetadata(this._post_filter_indices, panel_dom);
		}
	}
}
