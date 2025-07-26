import { ValidatorFn, Validators } from '@angular/forms';
// import { FieldType } from '../enums/field-type';

export class FieldConfig {
    name = "";
    displayText = "";
    // type: FieldType = FieldType.TEXT;
    showOnList: boolean = true;
    validators: ValidatorFn[] = [];
    sortHeader: boolean = true;
    values: any[] = [];
    valueTransformer = (value: any) => { return value };
    style = (value: any) => {return {}};
}