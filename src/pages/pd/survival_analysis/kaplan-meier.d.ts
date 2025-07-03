export default class KaplanMeier {
    id: number;
    constructor(id: number);
    UpdateDataset(parent_id: number, km_data: any[]): void;
    RemoveDataset(parent_id: number): void;
    UpdateUI(): void;
}
