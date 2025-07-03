export default class FilterGroup {
    id: number;
    indices: number[];
    constructor(id: number, records: any[], ref_dom: Element | null, dataset: any);
    GetDOM(): HTMLElement;
    // ...other members as needed
}
