export enum FilterType {
    TEXT
}

export class FilterConfig {
    name: string = "";
    label: string = "";
    type: FilterType = FilterType.TEXT;
}

