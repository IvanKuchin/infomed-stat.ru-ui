export default class OddsRatio {

	constructor(id) { 
		this.id = id;
		this._datasets = [];
		this.calc = new OddsCalc();
		this._RenderMonthsEditor("months-setup", this.calc.GetMonths());
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

	// Callback for input change event
	// Updates months array in calc object
	_ChangeMonthHandler(event) {
		const month_idx = parseInt(event.target.getAttribute("month_idx"));
		const month = parseInt(event.target.value);
		this.calc.SetMonth(month_idx, month);
		
		const months = this.calc.GetMonths();

		// update GUI with new months
		let prev_month_input = document.querySelector(`[or-group="${this.id}"] [months-setup] input[month_idx="${month_idx - 1}"]`);
		let next_month_input = document.querySelector(`[or-group="${this.id}"] [months-setup] input[month_idx="${month_idx + 1}"]`);

		if (prev_month_input) {
			prev_month_input.setAttribute("max", month - 1);
		}

		if (next_month_input) {
			next_month_input.setAttribute("min", month + 1);
		}

		this.UpdateUI();
	}

	_RenderMonthsEditor(months_id, months) {
		let months_editor = document.querySelector(`[or-group="${this.id}"] [${months_id}]`);

		months_editor.innerHTML = "";

		let section = document.createElement("section");
		section.style = "display: flex;";

		for (let i = 0; i < months.length; i++) {
			const min = i == 0 ? 1 : months[i-1] + 1;
			const max = i + 1 < months.length - 1 ? months[i + 1] - 1 : 1000;
			let input = document.createElement("input");
			input.setAttribute("type", "number");
			input.setAttribute("value", months[i]);
			input.setAttribute("min", min);
			input.setAttribute("max", max);
			input.setAttribute("step", "1");
			input.setAttribute("month_idx", i);
			input.classList.add("form-control");
			input.addEventListener("change", this._ChangeMonthHandler.bind(this));

			section.appendChild(input);
		}

		months_editor.appendChild(section);
	
	}

	_GetGroupTitle() {
		return "Группа";
	}

	_GetTableHeader(titles) {
		let head = document.createElement("thead");
		let tr = document.createElement("tr");
		for (var i = 0; i < titles.length + 1; i++) {
			let td = document.createElement("th");
			if(i) {
				td.appendChild(document.createTextNode(`${titles[i-1]}`))
			}
			tr.appendChild(td);
		}

		head.appendChild(tr);

		return head;
	}

	_GetTotalByColumn(matrix, column) {
		let total = 0;
		for (let i = 0; i < matrix.length; i++) {
			total += matrix[i][column].value;
		}

		return total;
	}

	_GetTableBody(matrix, callback_item_value) {
		let tbody = document.createElement("tbody");

		for (let i = 0; i < matrix.length; i++) {
			const row = matrix[i];
			let tr = document.createElement("tr");
			let th = document.createElement("th");

			let ds_id = this._datasets[i].parent_id;
			th.appendChild(document.createTextNode(`${this._GetGroupTitle()} ${ds_id}`))

			tr.appendChild(th);

			for (let j = 0; j < row.length; j++) {
				let td = document.createElement("td");
				td.setAttribute("cell_coordinate", `${i}_${j}`);
				const elem = document.createElement("span");
				elem.innerHTML = callback_item_value(matrix[i][j]);
				td.appendChild(elem);
				tr.appendChild(td);
			}

			tbody.appendChild(tr);
		}

		return tbody;
	}

	_GetTableDOM(matrix, titles, callback_item_value) {
		let table = document.createElement("table");
		table.classList.add("table", "table-striped");

		table.appendChild(this._GetTableHeader(titles));
		table.appendChild(this._GetTableBody(matrix, callback_item_value));

		return table;
	}

	_DrawGUITable(table_title, matrix, callback_item_value) {
		let datasets = this._datasets;

		document.querySelector(`[or-group="${this.id}"] [${table_title}]`).innerHTML = "";
		document.querySelector(`[or-group="${this.id}"] [${table_title}]`).appendChild(this._GetTableDOM(matrix, this.calc.GetMonths(), callback_item_value));
	}

	_DrawMedianGUITable(table_title, matrix, callback_item_value) {
		let datasets = this._datasets;

		document.querySelector(`[ms-group="${this.id}"] [${table_title}]`).innerHTML = "";
		document.querySelector(`[ms-group="${this.id}"] [${table_title}]`).appendChild(this._GetTableDOM(matrix, ["месяцев"], callback_item_value));
	}


	_Draw_OR_GUITables(table_title, data) {
		const months = data.months;
		const or = data.or;

		document.querySelector(`[or-group="${this.id}"] [${table_title}]`).innerHTML = "";

		for (let i = 0; i < months.length; i++) {
			let row = document.createElement("div");
			row.classList.add("row");

			let col_title = document.createElement("div");
			col_title.classList.add("col-xs-12", "text-center");
			col_title.appendChild(document.createTextNode(`Относительные щансы выживаемости между группами (Odds Ratio) ${months[i]} месяцев`));
			
			let col_table = document.createElement("div");
			col_table.classList.add("col-xs-12");
			let cb = this._GetORAndCI(i).bind(this);
			let groups_title = [...Array(or.length).keys()].map((idx) => this._GetGroupTitle() + " " + idx);
			col_table.appendChild(this._GetTableDOM(or, groups_title, cb));

			row.appendChild(col_title);
			row.appendChild(col_table);

			document.querySelector(`[or-group="${this.id}"] [${table_title}]`).appendChild(row);
		}
	}

	_RoundToTwo(num) {
		return +(Math.round(num + "e+2")  + "e-2");
	}

	_AddExplanations(explanation_id, text) {
		document.querySelector(`[or-group="${this.id}"] [${explanation_id}]`).innerHTML = text;
	}

	// must return string
	_GetProb(item) {
		return `${this._RoundToTwo(item.prob)}`;
	}

	// must return string
	_GetOddsAndCI(item) {
		const odds = this._RoundToTwo(item.odds);
		const ci_start = this._RoundToTwo(odds - item.ci);
		const ci_end = this._RoundToTwo(odds + item.ci);
		return `odds: ${odds}<br>CI: (${ci_start} - ${ci_end})`;
	}

	// must return string
	_GetORAndCI(month_idx) {
		return (item) => {
			const or = item[month_idx].or;
			const ci = item[month_idx].ci;

			if (isNaN(or) || isNaN(ci)) {
				return "";
			}

			return `OR:	${this._RoundToTwo(or)}<br>CI: (${this._RoundToTwo(or-ci)} - ${this._RoundToTwo(or+ci)})`;
		}
	}

	_GetMedian(item) {
		return item;
	}

	UpdateUI() {
		const calcs = this.calc.CalculateOddsRatio(this._datasets);

		this._DrawMedianGUITable("median-survivability-matrix", calcs.medians, this._GetMedian.bind(this));

		this._DrawGUITable("probability-over-months-matrix", calcs.odds, this._GetProb.bind(this));
		this._DrawGUITable("odds-over-months-matrix", calcs.odds, this._GetOddsAndCI.bind(this));
		this._Draw_OR_GUITables("odds-ratio-over-months-matrix", calcs);

		this._AddExplanations("prob-explanation", "Пояснения: Данные беруться из Kaplan-Meier графиков.");
		this._AddExplanations("odds-explanation", "Пояснения:<br>Если odds > 1, то шансы на выживание больше, чем у всех остальных периодов.<br>Если odds < 1, то шансы на выживание меньше чем у всех остальных периодов.");
		this._AddExplanations("odds-ratio-explanation", "Пояснения:<br>Если OR > 1, то шансы на выживание у вертикальной группы больше, чем у  горизональной.<br>Если OR < 1, то шансы на выживание у вертикальной группы меньше, чем у горизональной.");
	}
}


class OddsCalc {
	constructor() {
		this.months = [1*12, 2*12, 3*12, 5*12, 10*12];
	}

	GetMonths() {
		return this.months;
	}

	SetMonth(idx, month) {
		this.months[idx] = month;
	}

	_GetSurvivabilityByMonth(data, survival_month) {
		let value = -1

		for (let i = 0; i < data.length; i++) {
			if(data[i].Time <= survival_month) {
				value = data[i].Survival;
			} else {
				break;
			}
		}

		return value;
	}

	_GetPopulationSize(data) {
		let population = 0;

		for (let i = 0; i < data.length; i++) {
			population += data[i].Patients.length;
		}

		if (population == 0) {
			population = 1;
			throw new Error("Population size is 0");
		}

		return population
	}

	_GetProbabilitiesMatrix(datasets, months) {
		let matrix = new Array(datasets.length).fill(0).map(() => new Array(months.length).fill(NaN));

		for (let i = 0; i < datasets.length; i++) {
			const n = this._GetPopulationSize(datasets[i].data);
			for (let j = 0; j < months.length; j++) {
				const survival_month = months[j];
				const prob = this._GetSurvivabilityByMonth(datasets[i].data, survival_month);
				const odds = prob / (1 - prob + Number.EPSILON);
				const ci = 1.96 * Math.sqrt((prob * (1 - prob)) / n);
				matrix[i][j] = {
					prob: prob,
					odds: odds,
					ci: ci,
				};
			}
		}

		return matrix;
	}

	_GetOR(odds) {
		let matrix = new Array(odds.length).fill(0).map(() => new Array(odds.length).fill(0).map(() => new Array(odds[0].length).fill(NaN)));

		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix.length; j++) {
				if(i > j) {
					for (let k = 0; k < matrix[0][0].length; k++) {
						matrix[i][j][k] = {
							or: odds[i][k].odds / odds[j][k].odds,
							ci: Math.sqrt(Math.pow(odds[i][k].ci, 2) + Math.pow(odds[j][k].ci, 2)),
						}
					}
				}
			}
		}

		return matrix;
	}

	_GetMedianPerGroup(datasets) {
		let medians = new Array(datasets.length).fill(0);

		for (let i = 0; i < datasets.length; i++) {
			const data = datasets[i].data;
			let median = 0;

			for (let j = 0; j < data.length; j++) {
				if(data[j].Survival <= 0.5) {
					median = data[j].Time;
					break;
				}
			}

			medians[i] = new Array(1).fill(median);
		}

		return medians;
	}

	CalculateOddsRatio(datasets) {
		const odds = this._GetProbabilitiesMatrix(datasets, this.GetMonths());
		const or = this._GetOR(odds);
		const medians = this._GetMedianPerGroup(datasets);

		return {
			months: this.GetMonths(),
			odds: odds,
			or: or,
			medians: medians,
		}
	}
}
