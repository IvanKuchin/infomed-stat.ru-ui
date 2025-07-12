import DatasetGroup from "./dataset_list.js";
let dataset_group1 = new DatasetGroup(0);
const Init = () => {
    const create_dataset_button = document.getElementById("create_dataset");
    if (create_dataset_button) {
        create_dataset_button.addEventListener("click", CreateDataset_ClickHandler);
    }
};
const CreateDataset_ClickHandler = () => {
    const dataset = dataset_group1.CreateAndRenderDS();
    return { dataset };
};
Init();
