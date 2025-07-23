
export class CustomAction {
    private _title: string;
    private _onClick: any;
    private _icon: string;


    constructor(title: string, onClick: any, icon: string = '') {
		this._title = title;
		this._onClick = onClick;
        this._icon = icon;
	}


    /**
     * Getter title
     * @return {string}
     */
	public get title(): string {
		return this._title;
	}


    /**
     * Getter onClick
     * @return {any}
     */
	public get onClick(): any {
		return this._onClick;
	}

    public get icon(): string {
		return this._icon;
	}

    
}