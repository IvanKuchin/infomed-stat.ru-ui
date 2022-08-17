export default class Train {

	_GetModel() {
		const model = tf.sequential();

		// First layer must have an input shape defined.
		model.add(tf.layers.dense({units: 32, inputShape: [50]}));
		// Afterwards, TF.js does automatic shape inference.
		model.add(tf.layers.dense({units: 4}));

		console.log(JSON.stringify(model.outputs[0].shape));

		return model;
	}

	fit(X, Y) {
		let error = null

		let model = this._GetModel()


		async function showModel() {
		  const surface = {
		    name: 'Model Summary',
		    tab: 'Model'
		  };
		  tfvis.show.modelSummary(surface, model);
		}
		document.querySelector('#show-model').addEventListener('click', showModel);

		debugger

		return { error: error }
	}
}
