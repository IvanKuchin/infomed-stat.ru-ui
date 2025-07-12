import DatasetGroup from "./dataset_list.js"

let dataset_group1: DatasetGroup = new DatasetGroup(0);

const Init = (): void => {
    const create_dataset_button = document.getElementById("create_dataset") as HTMLButtonElement | null;
    if (create_dataset_button) {
        create_dataset_button.addEventListener("click", CreateDataset_ClickHandler);
    }
};

const CreateDataset_ClickHandler = (): { dataset: any } => {
    const dataset = dataset_group1.CreateAndRenderDS();
    return { dataset };
};

Init();
