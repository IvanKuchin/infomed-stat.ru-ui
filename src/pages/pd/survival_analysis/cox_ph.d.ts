export default class CoxPH {
    id: number;
    constructor(id: number);
    UpdateDataset(parent_id: number, data: any): void;
    RemoveDataset(parent_id: number): void;
    UpdateUI(): void;
}
