import { Observable } from "rxjs";

export enum FilterType {
    TEXT,
    TOGGLE,
    SELECT,
    MULTI_SELECT,
    DATE_RANGE,
    DATE,
    HIDDEN
}

export class FilterConfig {
    name: any;
    label: string = "";
    type: FilterType = FilterType.TEXT;
    values: Observable<any[]> | undefined;
    value: any;
}

