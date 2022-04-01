import DatasetGroup from "./dataset_list.js"

let dataset_group1 = new DatasetGroup();

var Init = function() {
	var create_dataset_button = document.getElementById("create_dataset");
	create_dataset_button.addEventListener("click", Create_Dataset_Click_Handler);
};

var Create_Dataset_Click_Handler = function() {
	let dom_placeholder = document.querySelectorAll("[dataset-group='0'")[0];
	let dataset = dataset_group1.CreateAndRenderDS(dom_placeholder);
};


Init();

