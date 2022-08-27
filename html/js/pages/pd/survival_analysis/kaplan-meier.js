/* globals Chart */

export default class KaplanMeier {

	constructor(id) { 
		this._data = {
			labels: [],
			datasets: []
		};

		this._config = {
			type: 'line',
			data: this._data,
			options: {
				plugins: {
					tooltip: {
						callbacks: {
							footer: this._footer,
						}
					}
				}
			}
		};

		this.id = id;

		this.InitializeGraph();
	}

	get id() { return this._id; }
	set id(id) { this._id = id; }

	InitializeGraph() {
		this._myChart = new Chart(
							document.querySelectorAll("[km-group='" + this.id + "'] canvas")[0],
							this._config
						);
	}

	_footer(tooltipItems) {
		let footer	= "";

		tooltipItems.forEach(function(tooltipItem) {
			let data	= tooltipItem.dataset.data;
			let label	= tooltipItem.label;

			for (let i = 0; i < data.length; i++) {
				if(data[i].x == label) {
					let patients = data[i].Patients;

					footer += `\n`;
					for (let i = 0; i < patients.length; i++) {
						let patient = patients[i];

						footer += `${patient.last_name} ${patient.first_name} ${patient.middle_name} гр.${patient.birthdate} (${patient.status})\n`;
					}

					break;
				}
			}

			// console.debug(`parent_id: ${tooltipItem.dataset.parent_id}, label: ${tooltipItem.label}, patients: `);

		});

		return footer;
	}

	_GetDatasetObject(parent_id) {
		let red		= Math.round(Math.random() * 255);
		let green	= Math.round(Math.random() * 255);
		let blue	= Math.round(Math.random() * 255);

		return {
			parent_id:			parent_id,
			stepped:			true,
			label:				'График ' + parent_id,
			backgroundColor:	`rgb(${red}, ${green}, ${blue})`,
			borderColor:		`rgb(${red}, ${green}, ${blue})`,
			data: 				[],
		}
	}

	_FindDSIndexByParentID(parent_id) {
		let datasets = this._data.datasets;
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
	UpdateDataset(parent_id, km_data) {
		let datasets = this._data.datasets;
		let ds_idx = this._FindDSIndexByParentID(parent_id);

		if(ds_idx == datasets.length) {
			datasets.push(this._GetDatasetObject(parent_id));
		}

		datasets[ds_idx].data = [];
		for (var i = 0; i < km_data.length; i++) {
			let	rec = km_data[i];

			datasets[ds_idx].data.push({ x: rec.Time, y: rec.Survival, Patients: rec.Patients });
		}
	}

	// Remove dataset from datasets[]
	RemoveDataset(parent_id) {
		let datasets = this._data.datasets;
		let ds_idx = this._FindDSIndexByParentID(parent_id);

		if(ds_idx == datasets.length) {
			// --- ok
		} else {
			datasets.splice(ds_idx, 1);
		}
	}

	// Calculates maximum X and update labels[]
	_UpdateLabels() {
		let datasets = this._data.datasets;
		let max_t = 0;

		for (let i = 0; i < datasets.length; ++i) {
			let	data = datasets[i].data;
			max_t = Math.max(max_t, data[data.length - 1].x);
		}

		this._data.labels = Array.from(Array(max_t + 1).keys());

	}

	UpdateUI() {
		this._UpdateLabels();

		this._myChart.update();
	}
}
