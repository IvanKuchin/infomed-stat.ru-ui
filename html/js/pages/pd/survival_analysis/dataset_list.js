import Dataset from "./dataset.js"

export default class DatasetGroup {
	_datasets = [];

	CreateDS() {
		let new_ds = new Dataset(this._datasets.length);

		this._datasets.push(new_ds);

		return new_ds;
	}

	CreateAndRenderDS(dom_placeholder) {
		let new_ds = this.CreateDS();

		new_ds.AddToParent(dom_placeholder);

		return new_ds;
	}
}
