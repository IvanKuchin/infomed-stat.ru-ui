export default class LogRank {
	_id;
	_datasets = [];

	constructor(id) { 
		this.id = id;

		document.querySelector(`[lr-group="${this.id}"] [alpha-value]`).addEventListener("change", this._PutLogRankValuesInGUI.bind(this));
	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

	_GetDatasetObject(parent_id) {
		return {
			parent_id:		parent_id,
			data: 			[],
		}
	}

	_FindDSIndexByParentID(parent_id) {
		let datasets = this._datasets;
		let ds_idx;

		for (ds_idx = 0; ds_idx < datasets.length; ++ds_idx) {
			if(datasets[ds_idx].parent_id == parent_id) {
				break;
			} 
		}

		return ds_idx;
	}

	// Replaces dataset with parent_id in datasets array with one provided as a parameter
	// Output: none 
	UpdateDataset(parent_id, data) {
		let datasets = this._datasets;
		let ds_idx = this._FindDSIndexByParentID(parent_id);

		if(ds_idx == datasets.length) {
			datasets.push(this._GetDatasetObject(parent_id));
		}

		datasets[ds_idx].data = data;
	}

	_GetGroupTitle() {
		return "График";
	}

	_GetTableHeader(length) {
		let head = document.createElement("thead");
		let tr = document.createElement("tr");
		for (var i = 0; i < length + 1; i++) {
			let td = document.createElement("th");
			td.appendChild(document.createTextNode(i ? `${this._GetGroupTitle()} ${i - 1}` : ""))
			tr.appendChild(td);
		}

		head.appendChild(tr);

		return head;
	}

	_GetTableBody(length) {
		let tbody = document.createElement("tbody");

		for (let i = 0; i < length; i++) {
			let tr = document.createElement("tr");

			let th = document.createElement("th");
			th.appendChild(document.createTextNode(`${this._GetGroupTitle()} ${i}`))

			tr.appendChild(th);

			for (let j = 0; j < length; j++) {
				let td = document.createElement("td");
				td.setAttribute("cell_coordinate", `${i}_${j}`);
				tr.appendChild(td);
			}

			tbody.appendChild(tr);
		}

		return tbody;
	}

	_GetTableDOM(length) {
		let table = document.createElement("table");
		table.classList.add("table", "table-striped");

		table.appendChild(this._GetTableHeader(length));
		table.appendChild(this._GetTableBody(length));

		return table;
	}

	_DrawGUITable() {
		let datasets = this._datasets;

		document.querySelector(`[lr-group="${this.id}"] [table-placeholder]`).innerHTML = "";
		document.querySelector(`[lr-group="${this.id}"] [table-placeholder]`).appendChild(this._GetTableDOM(datasets.length));
	}

	_GetEmptyObject() {
		return {
			Time: 0,
			AtRisk1: 0,
			AtRisk2: 0,
			AtRiskTotal: 0,
			Events1: 0,
			Events2: 0,
			EventsTotal: 0,
			ExpectedEvents1: 0,
			ExpectedEvents2: 0,
		}
	}

	// Find AtRisk-number at a timestamp
	// Input:
	// 		time - timestamp
	//		ds - dataset
	// Output:
	//		AtRisk value
	_GetAtRiskAtATime(time, ds) {
		let at_risk = ds.data[0].AtRisk;

		for (let i = 0; i < ds.data.length; i++) {
			let record = ds.data[i];

			if(time <= record.Time) {
				break;
			}
			at_risk = record.AtRisk;
		}

		return at_risk;
	}

	// Calculate LogRank data
	_LogRank(ds1, ds2) {
		let map = new Map();

		// Build initial map form existing datasets
		for (var i = 0; i < ds1.data.length; i++) {
			let record = ds1.data[i];
			if(record.Events) {
				if(map.has(record.Time)) {
				} else {
					map.set(record.Time, this._GetEmptyObject()) 
				}

				map.get(record.Time).Time		= record.Time;
				map.get(record.Time).Events1	= record.Events;
				map.get(record.Time).AtRisk1	= record.AtRisk;
			}
		}
		for (var i = 0; i < ds2.data.length; i++) {
			let record = ds2.data[i];
			if(record.Events) {
				if(map.has(record.Time)) {
				} else {
					map.set(record.Time, this._GetEmptyObject()) 
				}

				map.get(record.Time).Time		= record.Time;
				map.get(record.Time).Events2	= record.Events;
				map.get(record.Time).AtRisk2	= record.AtRisk;
			}
		}

		// Convert map to array
		let temp_table = [];
		map.forEach((v, k) => {
			temp_table.push(v);
		});

		let table = temp_table.sort((a, b) => a.Time - b.Time);

		// Fill blank values in AtRisk1 and AtRisk2
		for (let i = 0; i < table.length; i++) {
			if(table[i].AtRisk1) {
			} else {
				table[i].AtRisk1 = this._GetAtRiskAtATime(table[i].Time, ds1);
			}
			if(table[i].AtRisk2) {
			} else {
				table[i].AtRisk2 = this._GetAtRiskAtATime(table[i].Time, ds2);
			}
		}

		// Calculate TotalAtRisk, TotalNumberOfEvents, ExpectedNumberOfEvents
		for (let i = 0; i < table.length; i++) {
			table[i].AtRiskTotal = table[i].AtRisk1 + table[i].AtRisk2;
			table[i].EventsTotal = table[i].Events1 + table[i].Events2;

			table[i].ExpectedEvents1 = table[i].AtRisk1 * table[i].EventsTotal / table[i].AtRiskTotal;
			table[i].ExpectedEvents2 = table[i].AtRisk2 * table[i].EventsTotal / table[i].AtRiskTotal;
		}

		// Calculate sums: Events1, Events2, ExpectedEvents1, ExpectedEvents2
		let sumEvents1			= 0;
		let sumEvents2			= 0;
		let sumExpectedEvents1	= 0;
		let sumExpectedEvents2	= 0;
		for (let i = 0; i < table.length; i++) {
			sumEvents1			+= table[i].Events1;
			sumEvents2			+= table[i].Events2;
			sumExpectedEvents1	+= table[i].ExpectedEvents1;
			sumExpectedEvents2	+= table[i].ExpectedEvents2;
		}

		return Math.pow(sumEvents1 - sumExpectedEvents1, 2) / sumExpectedEvents1 + Math.pow(sumEvents2 - sumExpectedEvents2, 2) / sumExpectedEvents2;
	}

	_PutLogRankValuesInGUI() {
		let datasets = this._datasets;
		let alpha = parseFloat(document.querySelector(`[lr-group="${this.id}"] [alpha-value]`).value);
		let alpha_squared = Math.pow(alpha, 2);

		for (let i = 0; i < datasets.length; i++) {
			for(let j = 0; j < datasets.length; j++) {
				if(i > j) {
					let x_squared = this._LogRank(datasets[i], datasets[j]);
					let tag = document.querySelector(`[lr-group="${this.id}"] [cell_coordinate="${i}_${j}"]`);

					tag.innerHTML = "";
					tag.appendChild(document.createTextNode(x_squared));
					tag.classList.remove("danger", "success");
					tag.classList.add(x_squared > alpha_squared ? "danger" : "success");
				}
			}
		}
	}

	UpdateUI() {
		this._DrawGUITable();
		this._PutLogRankValuesInGUI();
	}

}
