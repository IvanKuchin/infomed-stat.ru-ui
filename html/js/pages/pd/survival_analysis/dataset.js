export default class Dataset {
	filters = [];

	constructor(id) { 
		this.id = id; // --- forwards it to setter 
	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

	GetDOM() {
		let panel = document.createElement("div");
		panel.setAttribute("dataset", this.id);
		panel.classList.add("panel", "panel-default")

		let panel_header = document.createElement("div");
		panel_header.classList.add("panel-heading");

		let panel_body = document.createElement("div");
		panel_body.classList.add("panel-heading");

		let collapse = document.createElement("div");
		collapse.setAttribute("aria-expanded", true);
		collapse.classList.add("row", "collapse");

		let collapse_top_shadow = document.createElement("div");
		collapse_top_shadow.classList.add("col-xs-12", "collapse-top-shadow", "margin_bottom_20");
		collapse_top_shadow.appendChild(document.createElement("p"));

		let collapse_body = document.createElement("div");
		collapse_body.setAttribute("body", "");
		collapse_body.classList.add("col-xs-12");

		let collapse_bottom_shadow = document.createElement("div");
		collapse_bottom_shadow.classList.add("col-xs-12", "collapse-bottom-shadow", "margin_bottom_20");
		collapse_bottom_shadow.appendChild(document.createElement("p"));

		panel.appendChild(panel_header);
		panel.appendChild(panel_body);
		panel_header.appendChild(document.createTextNode("DataSet " + this.id));
		panel_body.appendChild(collapse);
		collapse.appendChild(collapse_top_shadow);
		collapse.appendChild(collapse_body);
		collapse.appendChild(collapse_bottom_shadow);


		return panel;
	}

	ToggleCollapsible() {
		$("[dataset='" + this.id + "'] .collapse").collapse("toggle");
	}

	AddToParent(parentDOM) {
		parentDOM.appendChild(this.GetDOM());
		this.ToggleCollapsible();
	}
}


