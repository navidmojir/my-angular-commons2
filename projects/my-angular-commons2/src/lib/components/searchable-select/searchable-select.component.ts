import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { forwardRef } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-searchable-select',
  imports: [MatOptionModule, ReactiveFormsModule, MatSelectModule, CommonModule, FormsModule],
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements OnInit, /*AfterViewInit, OnDestroy,*/ ControlValueAccessor {

  @Input()
  formControlName!:string;

  @Input()
  required!: boolean;

  // control:AbstractControl;

  @Input()
  placeholder:string = '';

  @Input()
  type:string = 'text';

  @Input() options: any;

  @Input() form!: UntypedFormGroup;

  @Output() selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

  public selectControl: UntypedFormControl = new UntypedFormControl();

  public selectSearchControl: UntypedFormControl = new UntypedFormControl();

  public filteredOptions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();
  
  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    // console.log(this.options);
    // set initial selection
    // this.selectControl.setValue(this.options[0]);

    // load the initial options list
    this.filteredOptions.next(this.options.slice());

    // listen for search field value changes
    this.selectSearchControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptions();
      });

    // this.selectionChange = this.singleSelect.selectionChange;

    if(this.controlContainer && this.formControlName){
      this.selectControl = this.controlContainer.control?.get(this.formControlName) as UntypedFormControl;
   }
  }



  // ngAfterViewInit() {
    // this.setInitialValue();
  // }

  // ngOnDestroy() {
  //   this._onDestroy.next();
  //   this._onDestroy.complete();
  // }


  // protected setInitialValue() {
  //   this.filteredOptions
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredOptions are loaded initially
        // and after the mat-option elements are available
  //       this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
  //     });
  // }


  protected filterOptions() {
    if (!this.options) {
      return;
    }
    // get the search keyword
    let search = this.selectSearchControl.value;
    if (!search) {
      this.filteredOptions.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the options
    this.filteredOptions.next(
      this.options.filter((option: any) => option.persianTitle.toLowerCase().indexOf(search) > -1)
    );
  }

  callSelectionChange() {
    this.selectionChange.emit(new MatSelectChange(this.singleSelect, this.selectControl.value));
  }

  registerOnChange(){

  }

  registerOnTouched(){

  }
  writeValue(){

  }
  setDisabledState(){

  }

}
