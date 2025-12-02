import { Observable } from "rxjs";

export enum FilterType {
    TEXT,
    TOGGLE,
    MULTI_SELECT,
    DATE_RANGE,
    DATE
}

export class FilterConfig {
    name: any;
    label: string = "";
    type: FilterType = FilterType.TEXT;
    values: Observable<any[]> | undefined;
}

