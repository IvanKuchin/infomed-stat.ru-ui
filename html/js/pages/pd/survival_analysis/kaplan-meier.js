export default class KaplanMeier {
	_labels = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
	];

	_data = {
		labels: this._labels,
		datasets: [{
			parentid: 0,
			stepped: true,
			label: 'My First dataset',
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgb(255, 99, 132)',
			data: [],
		}]
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

	UpdateStepFunction() {
		this._data.datasets[0].data = [this.rnd(), this.rnd(), this.rnd(), this.rnd(), this.rnd(), this.rnd(), this.rnd()];
		this._myChart.update();
	}
}
