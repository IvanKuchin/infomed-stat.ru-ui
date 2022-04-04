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

	GetDOM() {
		let col = document.createElement("div");
		col.classList.add("col-xs-6", "col-md-1");
		col.setAttribute("filter", `${this.id}`)
		col.setAttribute("placeholder", "")

		let filter_key_div = document.createElement("div");
		let filter_key_sel = document.createElement("select");
		filter_key_sel.setAttribute("key", "");


		let filter_val_div = document.createElement("div");
		let filter_val_sel = document.createElement("select");
		filter_val_sel.setAttribute("values", "");
		filter_val_sel.setAttribute("multiple", "");
		filter_val_sel.setAttribute("size", "10");


		col				.appendChild(filter_key_div);
		col				.appendChild(filter_val_div);

		filter_key_div	.appendChild(filter_key_sel);		
		filter_val_div	.appendChild(filter_val_sel);		

		return col;
	}

}
