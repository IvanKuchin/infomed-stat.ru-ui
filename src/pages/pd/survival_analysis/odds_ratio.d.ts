export default class OddsRatio {
    id: number;
    constructor(id: number);
    UpdateDataset(parent_id: number, data: any[]): void;
    RemoveDataset(parent_id: number): void;
    UpdateUI(): void;
}
