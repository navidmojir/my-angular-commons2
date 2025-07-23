// import { Operation } from '../enums/operations';
import { IErrorMessageHandler } from '../interfaces/IErrorMessageHandler';
import { CustomAction } from './custom-action';
import { FieldConfig } from './field-config';
import { LabelConfigs } from './label-config';

export class CrudParams {
    private _baseUrl: string;
    private _resourceName: string;
	private _searchMethod: string;
    // private _operations: Operation[];
    private _fieldConfigs: FieldConfig[];
    private _errorMessageHandler: IErrorMessageHandler | null;
    private _rtl: boolean = false;
    private _labels: LabelConfigs;
    private _totalPagesHeaderName: string;
    private _customRecordActions: CustomAction[];
    private _customGeneralActions: CustomAction[];
	private _showToolbar: boolean;

    constructor(resourceName: string, fieldConfigs: FieldConfig[]) {
        this._baseUrl = "http://localhost:8080/";
        this._resourceName = resourceName;
        this._fieldConfigs = fieldConfigs;
        // this._operations = [Operation.CREATE, Operation.DETAILS, Operation.DELETE, 
        //     Operation.LIST, Operation.UPDATE];
        this._errorMessageHandler = null;
        this._rtl = true;
        this._labels = new LabelConfigs();
        this._totalPagesHeaderName = "X-TOTAL-COUNT";
        this._customRecordActions = [];
        this._customGeneralActions = [];
		this._searchMethod = "/search";
		this._showToolbar = true;
    }


	public get baseUrl(): string {
		return this._baseUrl;
	}


	public get resourceName(): string {
		return this._resourceName;
	}

	public get searchMethod(): string {
		return this._searchMethod;
	}

	// public get operations(): Operation[] {
	// 	return this._operations;
	// }

    
	public get fieldConfigs(): FieldConfig[] {
		return this._fieldConfigs;
	}


	public get errorMessageHandler(): IErrorMessageHandler | null  {
		return this._errorMessageHandler;
	}


	public get rtl(): boolean  {
		return this._rtl;
	}

	public get labels(): LabelConfigs {
		return this._labels;
	}

	public set baseUrl(value: string) {
		this._baseUrl = value;
	}

	public set resourceName(value: string) {
		this._resourceName = value;
	}

	// public set operations(value: Operation[]) {
	// 	this._operations = value;
	// }

	public set searchMethod(value: string) {
		this._searchMethod = value;
	}

	public set fieldConfigs(value: FieldConfig[]) {
		this._fieldConfigs = value;
	}

	public set errorMessageHandler(value: IErrorMessageHandler | null ) {
		this._errorMessageHandler = value;
	}

	public set rtl(value: boolean ) {
		this._rtl = value;
	}

	public set labels(value: LabelConfigs) {
		this._labels = value;
	}
    
	public get totalPagesHeaderName(): string {
		return this._totalPagesHeaderName;
	}

	public set totalPagesHeaderName(value: string) {
		this._totalPagesHeaderName = value;
	}


 
	public get customRecordActions(): CustomAction[] {
		return this._customRecordActions;
	}

	public set customRecordActions(value: CustomAction[]) {
		this._customRecordActions = value;
	}

    public get customGeneralActions(): CustomAction[] {
		return this._customGeneralActions;
	}

	public set customGeneralActions(value: CustomAction[]) {
		this._customGeneralActions = value;
	}

	public get showToolbar(): boolean {
		return this._showToolbar;
	}

	public set showToolbar(value: boolean) {
		this._showToolbar = value;
	}

}