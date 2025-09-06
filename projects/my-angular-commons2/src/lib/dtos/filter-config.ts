import { Observable } from "rxjs";

export enum FilterType {
    TEXT,
    TOGGLE,
    MULTI_SELECT
}

export class FilterConfig {
    name: string = "";
    label: string = "";
    type: FilterType = FilterType.TEXT;
    values: Observable<any[]> | undefined;
}

