/* globals Chart */

export default class LogRank {

	constructor(id) { 
		this.id = id;
		this._datasets = [];

		// Drawing normal distributions
		this._datapoints = [
					0.000291947,
					0.00042478,
					0.000611902,
					0.000872683,
					0.001232219,
					0.001722569,
					0.002384088,
					0.003266819,
					0.004431848,
					0.005952532,
					0.007915452,
					0.010420935,
					0.013582969,
					0.0175283,
					0.02239453,
					0.028327038,
					0.035474593,
					0.043983596,
					0.053990967,
					0.065615815,
					0.078950158,
					0.094049077,
					0.110920835,
					0.129517596,
					0.149727466,
					0.171368592,
					0.194186055,
					0.217852177,
					0.241970725,
					0.26608525,
					0.289691553,
					0.312253933,
					0.333224603,
					0.352065327,
					0.36827014,
					0.381387815,
					0.391042694,
					0.396952547,
					0.39894228,
					0.396952547,
					0.391042694,
					0.381387815,
					0.36827014,
					0.352065327,
					0.333224603,
					0.312253933,
					0.289691553,
					0.26608525,
					0.241970725,
					0.217852177,
					0.194186055,
					0.171368592,
					0.149727466,
					0.129517596,
					0.110920835,
					0.094049077,
					0.078950158,
					0.065615815,
					0.053990967,
					0.043983596,
					0.035474593,
					0.028327038,
					0.02239453,
					0.0175283,
					0.013582969,
					0.010420935,
					0.007915452,
					0.005952532,
					0.004431848,
					0.003266819,
					0.002384088,
					0.001722569,
					0.001232219,
					0.000872683,
					0.000611902,
					0.00042478,
					0.000291947
					];

		this._data = {
			labels: [],
			datasets: [
			{
				label: 'Χ',
				data: [],
				borderColor: "#00ff00",
				fill: false,
				cubicInterpolationMode: 'monotone',
				tension: 0.4
			}, {
				label: 'Left side',
				data: [],
				borderColor: "#ff0000",
				backgroundColor: "#ffaaaa",
				fill: true,
				cubicInterpolationMode: 'monotone',
				tension: 0.4
			}, {
				label: 'Right side',
				data: [],
				borderColor: "#ff0000",
				backgroundColor: "#ffaaaa",
				fill: true,
				cubicInterpolationMode: 'monotone',
				tension: 0.4
			}, {
				label: 'Normal standard distribution',
				data: this._datapoints,
				borderColor: "#bbbbbb",
				fill: false,
				cubicInterpolationMode: 'monotone',
				tension: 0.4
			}
			],
			min: -3.8,
			max: 3.8,
			x: [],
			chi_x: NaN,
		};

		this._config = {
			type: 'line',
			data: this._data,
			options: {
			responsive: true,
			plugins: {
				title: {
				display: true,
				text: 'Chart.js Line Chart - Cubic interpolation mode'
				},
			},
			interaction: {
				intersect: false,
			},
			scales: {
				x: {
				display: true,
				title: {
					display: true
				}
				},
				y: {
				display: true,
				title: {
					display: true,
					text: 'Value'
				},
				// suggestedMin: 0,
				// suggestedMax: 0.4
				}
			}
			},
		};

		document.querySelector(`[lr-group="${this.id}"] [alpha-value]`).addEventListener("change", this.UpdateUI.bind(this));

		this._InitializeGraph();
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

	// Remove dataset from datasets[]
	RemoveDataset(parent_id) {
		let datasets = this._datasets;
		let ds_idx = this._FindDSIndexByParentID(parent_id);

		if(ds_idx == datasets.length) {
			// --- success
		} else {
			datasets.splice(ds_idx, 1);
		}
	}

	_GetGroupTitle() {
		return "График";
	}

	_GetTableHeader(length) {
		let head = document.createElement("thead");
		let tr = document.createElement("tr");
		for (var i = 0; i < length + 1; i++) {
			let td = document.createElement("th");
			if(i) {
				let ds_id = this._datasets[i - 1].parent_id;
				td.appendChild(document.createTextNode(`${this._GetGroupTitle()} ${ds_id}`))
			}
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

			let ds_id = this._datasets[i].parent_id;
			th.appendChild(document.createTextNode(`${this._GetGroupTitle()} ${ds_id}`))

			tr.appendChild(th);

			for (let j = 0; j < length; j++) {
				let td = document.createElement("td");
				td.setAttribute("cell_coordinate", `${i}_${j}`);
				td.addEventListener("mouseenter", this._DrawLina_MouseEnterHandler.bind(this));
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
		for (let i = 0; i < ds1.data.length; i++) {
			let record = ds1.data[i];
			if(record.Events) {
				if(map.has(record.Time)) {
					// --- ok
				} else {
					map.set(record.Time, this._GetEmptyObject()) 
				}

				map.get(record.Time).Time		= record.Time;
				map.get(record.Time).Events1	= record.Events;
				map.get(record.Time).AtRisk1	= record.AtRisk;
			}
		}
		for (let i = 0; i < ds2.data.length; i++) {
			let record = ds2.data[i];
			if(record.Events) {
				if(map.has(record.Time)) {
					// --- ok
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
		map.forEach((v) => {
			temp_table.push(v);
		});

		let table = temp_table.sort((a, b) => a.Time - b.Time);

		// Fill blank values in AtRisk1 and AtRisk2
		for (let i = 0; i < table.length; i++) {
			if(table[i].AtRisk1) {
				// --- ok
			} else {
				table[i].AtRisk1 = this._GetAtRiskAtATime(table[i].Time, ds1);
			}
			if(table[i].AtRisk2) {
				// --- ok
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
		// let alpha_squared = Math.pow(alpha, 2);

		for (let i = 0; i < datasets.length; i++) {
			for(let j = 0; j < datasets.length; j++) {
				if(i > j) {
					let xsi_squared = this._LogRank(datasets[i], datasets[j]);
					let xsi 		= Math.sqrt(xsi_squared);
					let tag = document.querySelector(`[lr-group="${this.id}"] [cell_coordinate="${i}_${j}"]`);

					tag.innerHTML = "";
					tag.appendChild(document.createTextNode(xsi));
					tag.classList.remove("danger", "success");
					tag.classList.add(xsi > alpha ? "danger" : "success");
				}
			}
		}
	}


	_PlotNormalStdCurve() {
		let labels		= [];
		let step		= (this._data.max - this._data.min) / (this._datapoints.length - 1);
		this._data.x	= [];

		for (let i = 0; i < this._datapoints.length; ++i) {
			this._data.x.push(this._data.min + i * step);
			labels.push((this._data.x[i].toFixed(1)).toString());
		}
		this._data.labels = labels;
	}

	// Find closest value in x[] to a given x
	// Input:
	//		x - value to find
	// Output:
	//		index of closest value
	_GetClosestIndex(x) {
		let x_arr = this._data.x;
		let i = 0;

		for (i = 0; i < x_arr.length; i++) {
			if(x_arr[i] >= x) {
				if(i) {
					if(Math.abs(x - x_arr[i]) > Math.abs(x - x_arr[i - 1])) {
						--i;
					}
				}
				break;
			}
		}

		return i;
	}

	_PlotLeftSide(idx) {
		let datapoints = this._datapoints;
		let data = [];

		for (var i = 0; i < idx; i++) {
			data.push({x: this._data.labels[i], y: datapoints[i]});
		}

		return data;
	}

	_PlotRightSide(idx) {
		let datapoints = this._datapoints;
		let data = [];

		for (var i = idx; i < datapoints.length; i++) {
			data.push({x: this._data.labels[i], y: datapoints[i]});
		}

		return data;
	}

	_PlotSidePercentage() {
		let tag			= document.querySelector(`[lr-group="${this.id}"] [alpha-value]`);
		let start_x 	= tag.value;
		// let description	= tag.options[tag.selectedIndex].text;

		let idx_right	= this._GetClosestIndex(start_x);
		let	idx_left 	= this._datapoints.length - idx_right;

		let	left_side 	= this._PlotLeftSide(idx_left);
		let	right_side 	= this._PlotRightSide(idx_right);

		this._data.datasets[1].data = left_side;
		this._data.datasets[2].data = right_side;

	}

	_PlotChi() {
		let chi_x = this._data.chi;

		if(isNaN(chi_x)) {
			// nothing to do
		} else {
			let idx		= this._GetClosestIndex(chi_x);
			let data	= [{x: this._data.labels[idx], y: 0.2}, {x: this._data.labels[idx], y: 0.0}]

			this._data.datasets[0].data = data;
		}
	}

	_DrawLina_MouseEnterHandler(e) {
		let	tag		= e.target;
		let x_value	= parseFloat(tag.innerText); 
		
		this._data.chi = x_value;

		this._PlotGraph();
	}

	_PlotGraph() {
		this._PlotNormalStdCurve();
		this._PlotSidePercentage();
		this._PlotChi();

		this._myChart.update();
	}

	_InitializeGraph() {
		this._myChart = new Chart(
							document.querySelectorAll("[lr-group='" + this.id + "'] canvas")[0],
							this._config
							);
	}

	// Normal distribution ends


	UpdateUI() {
		this._DrawGUITable();
		this._PutLogRankValuesInGUI();

		this._PlotGraph();
	}
}
