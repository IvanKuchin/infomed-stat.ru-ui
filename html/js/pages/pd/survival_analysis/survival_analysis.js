import DatasetGroup from "./dataset_list.js"

let dataset_group1		= new DatasetGroup(0);

var Init = function() {
	let create_dataset_button = document.getElementById("create_dataset");
	create_dataset_button.addEventListener("click", CreateDataset_ClickHandler);
};

var CreateDataset_ClickHandler = function() {
	let dataset = dataset_group1.CreateAndRenderDS();
};

Init();
