/* globals tf, tfvis */

export default class Train {

	constructor () {
		this._model = null;
	}

	_GetModel1() {
		const model = tf.sequential();

		// First layer must have an input shape defined.
		model.add(tf.layers.dense({units: 32, inputShape: [50]}));
		// Afterwards, TF.js does automatic shape inference.
		model.add(tf.layers.dense({units: 4}));

		console.log(JSON.stringify(model.outputs[0].shape));

		return model;
	}

	_GetModel2() {
		const input1 = tf.input({shape: [10]});
		const input2 = tf.input({shape: [20]});
		const dense1 = tf.layers.dense({units: 4}).apply(input1);
		const dense2 = tf.layers.dense({units: 8}).apply(input2);
		const concat = tf.layers.concatenate().apply([dense1, dense2]);
		const output = tf.layers.dense({units: 3, activation: 'softmax'}).apply(concat);

		const model = tf.model({inputs: [input1, input2], outputs: output});

		return model;
	}

	_GetUniqueValues(arr) {
		return [... new Set(arr)];
	}

	_BuildInputLayers(X) {
		let input_layers = [];

		// --- first column of X is the only column contains more than one value
		// --- separate it out from the rest of the columns
		{
			const input_0 = tf.input({ shape: [X[0][0].length], name: `input_0` });
			input_layers.push(input_0);
		}

		for (let i = 1; i < X.length; ++i) {
			const input_i = tf.input({ shape: [1], name: `input_${i}` });
			input_layers.push(input_i);
		}

		return input_layers
	}

	_BuildEmbeddings(prev_layers, X) {
		let embedding_layers = [];
		let embedding_outputs = [];

		// --- first column of X is the only column contains numeric values
		// --- it should have dense layers, rather than embeddings
		const dense_0 = tf.layers.dense({ units: 16, activation: "relu", name: "inp_dense0" });
		embedding_layers.push(dense_0);

		for (let i = 1; i < X.length; ++i) {
			const count_uniq_vals = this._GetUniqueValues(X[i]).length;
			const embedding_layer = tf.layers.embedding({ inputDim: count_uniq_vals, outputDim: 8, name: `emb_${i}`});

			embedding_layers.push(embedding_layer);
		}

		for (let i = 0; i < embedding_layers.length; ++i) {
			let embedding_output = embedding_layers[i].apply(prev_layers[i]);
			embedding_outputs.push(embedding_output);
		}

		return {layers: embedding_layers, outputs: embedding_outputs};
	}

	_BuildDenseLayers(prev_outputs, neurons, activation, name_prefix) {
		let dense_layers = [];
		let dense_outputs = [];
		let reshape_outputs = [];

		for (let i = 0; i < prev_outputs.length; ++i) {
			const dense_layer = tf.layers.dense({ units: neurons, activation: activation, name:`${name_prefix}_dense${i}` });
			const dense_output = dense_layer.apply(prev_outputs[i]);
			dense_layers.push(dense_layer);
			dense_outputs.push(dense_output);
		}

		for (let i = 0; i < dense_outputs.length; ++i) {
			let reshape_layer = tf.layers.reshape({targetShape: [neurons], name:`${name_prefix}_reshape${i}`});
			let reshape_output = reshape_layer.apply(dense_outputs[i]);
			reshape_outputs.push(reshape_output);
		}

		return {layers: dense_layers, outputs: reshape_outputs};
	}

	_GetModel(X) {
		// --- input layers
		const input_layers		= this._BuildInputLayers(X);

		// --- embedding layers
		const embedding_layers	= this._BuildEmbeddings(input_layers, X);

		// -- dense layers
		const dense_layers_0	= this._BuildDenseLayers(embedding_layers.outputs, 16, "relu", "emb");

		// === change to single column
		// const trunk_dense_0 = tf.layers.dense({ units: 16, activation: "relu", name: "trunk_dense0" }).apply(dense_layers_0.outputs);
		const concat		= tf.layers.concatenate({ name: `concat_1` }).apply(dense_layers_0.outputs);
		const trunk_dense_0 = tf.layers.dense({ units: 16, activation: "relu", name: "trunk_dense_0" }).apply(concat);

		const trunk_dense_1 = tf.layers.dense({ units: 32, activation: "relu", name: "trunk_dense1" }).apply(trunk_dense_0);
		const trunk_dense_2 = tf.layers.dense({ units: 64, activation: "relu", name: "trunk_dense2" }).apply(trunk_dense_1);
		const trunk_dense_3 = tf.layers.dense({ units: 32, activation: "relu", name: "trunk_dense3" }).apply(trunk_dense_2);
		const trunk_dense_4 = tf.layers.dense({ units: 16, activation: "relu", name: "trunk_dense4" }).apply(trunk_dense_3);
		const output		= tf.layers.dense({ units: 1, name: "predictor" }).apply(trunk_dense_4);

		const model = tf.model({inputs: input_layers, outputs: output});

		model.compile({
			optimizer: tf.train.adam(),
			loss: "meanSquaredError",
			metrics: ["accuracy"],
		});

		// model.summary();

		return model
	}

	_ConvertArraysToTensors(X, Y) {
		let rows = Y.length;
		let trainY = tf.tensor(Y, [rows, 1]);
		let trainX = [];
		let error = null;

		for(let i = 0; i < X.length; ++i) {
			if(typeof(X[i][0]) == "number") {
				trainX.push(tf.tensor(X[i], [rows, 1]));
			} else {
				trainX.push(tf.tensor(X[i]));
			}
		}

		return { X: trainX, Y: trainY, error: error };
	}



	async fit(X, Y) {
		let error = null

		// --- Crafting the model 
		let model = this._GetModel(X);

		// --- Show model summary in GUI
		async function showModel() {
			const surface = {
				name: 'Model Summary',
				tab: 'Model'
			};
			tfvis.show.modelSummary(surface, model);
		}
		document.querySelector('#show-model').addEventListener('click', showModel);

		// --- Convert arrays to tensors
		const trainData = this._ConvertArraysToTensors(X, Y);

		// --- Train function
		async function train(obj, model, X, Y, callbacks) {
			// === change to single column
			return model.fit(X, Y, {
				batchSize: 16,
				epochs: common_infomed_stat.GetMaxEpochs(), 
				validationSplit: 0.2,
				shuffle: true,
				callbacks: callbacks,
			});

		}
		const callbacks = [
			new tf.CustomCallback({
				onEpochEnd: async (epoch, logs) => {
					console.log(`EPOCH (${epoch + 1}): Train Loss: ${logs.loss}, Train Accuracy: ${(logs.acc * 100).toFixed(2)}, Val Loss: ${logs.val_loss}, Val Accuracy:	${(logs.val_acc * 100).toFixed(2)}`);
					common_infomed_stat.ChangeStageState("_train", "fa fa-refresh fa-spin", `#${epoch + 1}, max: ${common_infomed_stat.GetMaxEpochs()}`);
				},
			}),
			tf.callbacks.earlyStopping({monitor: 'val_loss', patience: 5 })
			];

		const res = await train(this, model, trainData.X, trainData.Y, callbacks);
		console.debug(`training result: EPOCHS: ${res.epoch.length}, val_loss: ${res.history.val_loss}`);

		this._model = model;

/*
		async function watchTraining() {
			const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
			const container = {
			name: 'show.fitCallbacks',
			tab: 'Training',
			styles: {
				height: '1000px'
			}
			};
			const callbacks = tfvis.show.fitCallbacks(container, metrics);
			return train(model, trainData.X, trainData.Y, callbacks);
		}
		document.querySelector('#start-training').addEventListener('click', watchTraining);
*/


		return { error: error }
	}

	// --- prediction from neural net
	// 		input: array of arrays
	// 		output:	array of a single element
	predict(X) {
		const	inferenceData	= this._ConvertArraysToTensors(X, [0]);
		let 	result			= this._model.predict(inferenceData.X);
		let		prediction		= result.dataSync()[0];

		return [prediction];
	}
}
