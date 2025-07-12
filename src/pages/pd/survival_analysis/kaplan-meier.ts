/* globals Chart */

// Type definitions for Chart.js (minimal, for local usage)
declare const Chart: any;

export type Patient = {
	last_name: string;
	first_name: string;
	middle_name: string;
	birthdate: string;
	status: string;
};

type KMDataPoint = {
	x: number;
	y: number;
	Patients: Patient[];
};

type Dataset = {
	parent_id: number;
	stepped: boolean;
	label: string;
	backgroundColor: string;
	borderColor: string;
	data: KMDataPoint[];
};

interface ChartData {
	labels: number[];
	datasets: Dataset[];
}

interface ChartConfig {
	type: string;
	data: ChartData;
	options: any;
}

export default class KaplanMeier {
	private _data: ChartData;
	private _config: ChartConfig;
	private _myChart: any;
	private _id: number = 0;

	constructor(id: number) {
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

	get id(): number { return this._id; }
	set id(id: number) { this._id = id; }

	InitializeGraph(): void {
		this._myChart = new Chart(
			document.querySelectorAll("[km-group='" + this.id + "'] canvas")[0],
			this._config
		);
	}

	private _footer(tooltipItems: any[]): string {
		let footer = "";

		tooltipItems.forEach(function (tooltipItem) {
			let data = tooltipItem.dataset.data;
			let label = tooltipItem.label;

			for (let i = 0; i < data.length; i++) {
				if (data[i].x == label) {
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

	private _GetDatasetObject(parent_id: number): Dataset {
		let red = Math.round(Math.random() * 255);
		let green = Math.round(Math.random() * 255);
		let blue = Math.round(Math.random() * 255);

		return {
			parent_id: parent_id,
			stepped: true,
			label: 'График ' + parent_id,
			backgroundColor: `rgb(${red}, ${green}, ${blue})`,
			borderColor: `rgb(${red}, ${green}, ${blue})`,
			data: [],
		}
	}

	private _FindDSIndexByParentID(parent_id: number): number {
		let datasets = this._data.datasets;
		let ds_idx;

		for (ds_idx = 0; ds_idx < datasets.length; ++ds_idx) {
			if (datasets[ds_idx].parent_id == parent_id) {
				break;
			}
		}

		return ds_idx;
	}

	// Replaces dataset with parent_id in datasets array with one provided as a parameter
	// Output: none 
	UpdateDataset(parent_id: number, km_data: { Time: number; Survival: number; Patients: Patient[] }[]): void {
		let datasets = this._data.datasets;
		let ds_idx = this._FindDSIndexByParentID(parent_id);

		if (ds_idx == datasets.length) {
			datasets.push(this._GetDatasetObject(parent_id));
		}

		datasets[ds_idx].data = [];
		for (var i = 0; i < km_data.length; i++) {
			let rec = km_data[i];

			datasets[ds_idx].data.push({ x: rec.Time, y: rec.Survival, Patients: rec.Patients });
		}
	}

	// Remove dataset from datasets[]
	RemoveDataset(parent_id: number): void {
		let datasets = this._data.datasets;
		let ds_idx = this._FindDSIndexByParentID(parent_id);

		if (ds_idx == datasets.length) {
			// --- ok
		} else {
			datasets.splice(ds_idx, 1);
		}
	}

	// Calculates maximum X and update labels[]
	private _UpdateLabels(): void {
		let datasets = this._data.datasets;
		let max_t = 0;

		for (let i = 0; i < datasets.length; ++i) {
			let data = datasets[i].data;
			max_t = Math.max(max_t, data[data.length - 1].x);
		}

		this._data.labels = Array.from(Array(max_t + 1).keys());

	}

	UpdateUI(): void {
		this._UpdateLabels();

		this._myChart.update();
	}
}
