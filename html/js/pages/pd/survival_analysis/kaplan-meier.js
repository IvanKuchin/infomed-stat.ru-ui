export default class KaplanMeier {
	_data = {
		labels: [],
		datasets: []
	};

	_config = {
		type: 'line',
		data: this._data,
		options: {}
	};

	constructor(id) { 
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

	rnd() {
		return Math.random() * 50;
	}

	_GetDatasetObject(parent_id) {
		let red		= Math.round(Math.random() * 255);
		let green	= Math.round(Math.random() * 255);
		let blue	= Math.round(Math.random() * 255);

		return {
			parent_id:			parent_id,
			stepped:			true,
			label:				'Dataset' + parent_id,
			backgroundColor:	`rgb(${red}, ${green}, ${blue})`,
			borderColor:		`rgb(${red}, ${green}, ${blue})`,
			data: [],
		}
	}

	UpdateDataset(parent_id, km_data) {
		let datasets = this._data.datasets;
		let ds_idx;

		for (ds_idx = 0; ds_idx < datasets.length; ++ds_idx) {
			if(datasets[ds_idx].parent_id == parent_id) {
				break;
			} 
		}

		if(ds_idx == datasets.length) {
			datasets.push(this._GetDatasetObject(parent_id));
		}

		datasets[ds_idx].data = [
			{ x: 0, y: this.rnd() }, 
			{ x: 1, y: this.rnd() }, 
			{ x: 2, y: this.rnd() }, 
			{ x: 4, y: this.rnd() }, 
			{ x: 5, y: this.rnd() }, 
			{ x: 6, y: this.rnd() }, 
			{ x: 8, y: this.rnd() },
		];
	}

	UpdateStepFunction() {
		this._data.labels = Array.from(Array(10).keys());
		this._myChart.update();
	}
}
