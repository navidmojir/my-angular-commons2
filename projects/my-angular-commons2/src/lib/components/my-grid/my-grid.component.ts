import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CrudParams } from '../../dtos/crud-params';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { getPersianPaginatorIntl } from '../../utils/persian-paginator-intl';
import { BaseService } from '../../services/base-service/base.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FilterConfig, FilterType } from '../../dtos/filter-config';
import { AuthService } from '../../auth/auth-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarDate } from '@internationalized/date';
import { MatChipsModule } from '@angular/material/chips';
import { firstValueFrom } from 'rxjs';

export interface SelectedFilter {
  label: string;
  value: any;
  name: string;
}

@Component({
  selector: 'search-filters-dialog',
  templateUrl: 'search-filters-dialog.html',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,
    CommonModule, MatSlideToggleModule, MatSelectModule, MatDatepickerModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    mat-form-field{width:100%}
  `]
})
export class SearchFiltersDialog implements OnInit {
  FilterType = FilterType;
  filterConfig: FilterConfig[] = [];
  filters = new UntypedFormGroup({});
  currentFilters: any = {};
  constructor(private dialogRef: MatDialogRef<SearchFiltersDialog>

  ) {
  }
  ngOnInit(): void {
    for (let fc of this.filterConfig) {
      if (fc.type == FilterType.DATE_RANGE) {
        this.filters.addControl(fc.name, new UntypedFormGroup({
          start: new UntypedFormControl(), end: new UntypedFormControl()
        }));
        this.convertCurrentFilterToCalendarDate(fc.name);
      }
      else
        this.filters.addControl(fc.name, new UntypedFormControl(fc.value));
    }
    // console.log("form structure ", this.filters)
    // console.log("patching value to filters", this.currentFilters)
    this.filters.patchValue(this.currentFilters);
    // console.log("form structure after patch value", this.filters)
  }

  private convertCurrentFilterToCalendarDate(name: string) {
    if (this.currentFilters[name]) {
      if (this.currentFilters[name]["start"])
        this.currentFilters[name]["start"] = new CalendarDate(
          this.currentFilters[name]["start"]["year"],
          this.currentFilters[name]["start"]["month"],
          this.currentFilters[name]["start"]["day"]
        );
      if (this.currentFilters[name]["end"])
        this.currentFilters[name]["end"] = new CalendarDate(
          this.currentFilters[name]["end"]["year"],
          this.currentFilters[name]["end"]["month"],
          this.currentFilters[name]["end"]["day"]
        );
    }
  }


  applyFilter() {
    console.log(this.filters.value);

    this.dialogRef.close(this.filters.value
      /*, selectedFilters: this.makeSelectedFilters() }*/);

  }
  cancelFilter() {
    this.filters.reset();
    // console.log(this.filters.value);


    this.dialogRef.close(this.filters.value);
  }
  close() {
    this.dialogRef.close(false);
  }




}

@Component({
  imports: [
    CommonModule,
    MatPaginator,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getPersianPaginatorIntl() }
  ],
  selector: 'lib-my-grid',
  templateUrl: './my-grid.component.html',
  styleUrls: ['./my-grid.component.css']
})
export class MyGridComponent implements OnInit {

  @Input() filters: any;

  showDetailsButton = true;
  showDeleteButton = false;

  entities: any[] = [];

  //   entity: any = {};

  //   currentEntityId: any = 0;

  //   operationType = Operation;
  selectedFilters: SelectedFilter[] = [];

  displayedCols: String[] = [];

  sorting: any = {};

  paging: any = {};

  onInitSort: boolean = false;

  queryParams: any = {};

  @Input() params: CrudParams = {} as any;

  @Input() prefix: string = "1";

  dialogRef: MatDialogRef<ConfirmationDialogComponent> = {} as any;

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as any;

  sort: any;

  constructor(private baseService: BaseService,
    public dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // this.displayedCols = ['front', 'back'];



    this.initializeSorting();
    this.initializePaging();
    this.initializeFilters();

    if (this.entities.length == 0)
      this.getDataFromBackend();

    for (var fc of this.params.fieldConfigs) {
      if (fc.showOnList == true)
        this.displayedCols.push(fc.name);
    }
    this.displayedCols.push("operations");


  }

  reload(): void {
    this.setToLocalStorage('sorting', this.sorting);
    this.setToLocalStorage('paging', this.paging);
    this.setToLocalStorage('filters', this.filters);
    this.getDataFromBackend();
  }

  reloadFromPageZero(): void {
    this.paging['pageNumber'] = 0;
    this.paginator.pageIndex = 0;
    this.reload();
  }

  //removed from ng init to fix bug when using two components in same page
  private initDataService() {
    this.baseService.setBaseUrl(this.params.baseUrl);
    this.baseService.setResourceName(this.params.resourceName);
    this.baseService.setSearchMethod(this.params.searchMethod);
    // this.dataService.setErrorMsgHandler(this.params.errorMessageHandler);
    // this.baseService.setSearchMethod(this.params.searchMethod);
  }

  private getDataFromBackend(): void {
    this.initDataService();
    this.baseService.search(this.filters, this.paging, this.sorting).subscribe(
      (result: any) => {
        this.entities = result.body;
        this.paginator.length = +result.headers.get(this.params.totalPagesHeaderName);
      }
    );

  }

  // operationEnabled(operation: Operation): boolean {
  //   return this.params.operations.includes(operation);
  // }

  // showDetails(id: any): void{
  //   alert('implement!');
  // this.currentEntityId = id;
  // this.changePanel(PanelType.DETAILS);
  // }

  // changePanel(panel: PanelType) {
  //   this.currentPanel = panel;
  //   if(panel == PanelType.LIST)
  //     this.reload();
  // }

  // create(): void {
  //   this.entity = {};
  //   this.changePanel(PanelType.CREATE);
  // }

  // edit(element: any): void {
  //   this.entity = element;
  //   this.changePanel(PanelType.CREATE);
  // }

  delete(id: any): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "آیا عملیات حذف را تایید می کنید؟"

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initDataService();
        this.baseService.remove(id).subscribe(
          (result: any) => this.reload()
        );
      }
      this.dialogRef = {} as any;
    });

  }

  applySorting(ev: any): void {
    if (ev.direction == '') {
      this.sorting = null;
    }
    else {
      this.sorting = {
        sortField: ev.active,
        ascending: (ev.direction == 'asc' ? true : false)
      };
    }

    this.setToLocalStorage('sorting', this.sorting);

    if (this.onInitSort == true)  //to prevent calling backend twice on page load when setting sort fields
      this.onInitSort = false;
    else
      this.getDataFromBackend();
  }

  applyPaging(pageEvent: PageEvent): void {

    this.paging['pageNumber'] = pageEvent.pageIndex;
    this.paging['pageSize'] = pageEvent.pageSize;

    this.setToLocalStorage("paging", this.paging);

    this.getDataFromBackend();
  }

  get(element: any, fieldConf: any) {
    let names = fieldConf.name.split('.');
    if (names.length == 1)
      return element[names[0]];
    if (names.length == 2) {
      if (element[names[0]] == null)
        return null;
      return element[names[0]][names[1]];
    }
    if (names.length == 3) {
      if (element[names[0]] == null || element[names[0]][names[1]] == null)
        return null;
      return element[names[0]][names[1]][names[2]];
    }
    return "unsupported field name";
  }

  private setToLocalStorage(key: string, value: any): void {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  private getFromLocalStorage(key: string): any {
    return JSON.parse(localStorage.getItem(this.prefix + key) || '{}');
  }

  private initializeSorting() {
    this.sorting = this.getFromLocalStorage("sorting");
    if (this.sorting == null) {
      this.sort = {
        direction: '',
        active: ''
      };
      return;
    }

    this.sort = {
      direction: this.sorting['ascending'] ? 'asc' : 'desc',
      active: this.sorting['sortField']
    };
  }

  private initializePaging() {
    this.paging = this.getFromLocalStorage("paging");
    if (this.paging == null) {
      this.paging = {};
      return;
    }
  }

  private initializeFilters() {
    this.filters = this.getFromLocalStorage("filters");
    if (this.filters == null)
      this.filters = {};

    this.applyHiddenFilters();
    this.makeSelectedFilters();
  }

  private applyHiddenFilters() {
    for (let filterConf of this.params.filterConfigs) {
      if (filterConf.type == FilterType.HIDDEN)
        this.filters[filterConf.name] = filterConf.value;
    }
  }

  openSearchDialog() {
    let dialogRef = this.dialog.open(SearchFiltersDialog);
    dialogRef.componentInstance.currentFilters = this.filters;
    dialogRef.componentInstance.filterConfig = this.params.filterConfigs;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (!result)
          return;
        this.filters = result;
        this.applyHiddenFilters();
        this.reloadFromPageZero();
        this.makeSelectedFilters();
        // this.selectedFilters = result.selectedFilters;
      }
    )
  }


  removeFilter(filter: SelectedFilter) {
    this.filters[filter.name] = null;
    this.selectedFilters.splice(this.selectedFilters.indexOf(filter), 1);
    this.applyHiddenFilters();
    this.reloadFromPageZero();
  }

  private async makeSelectedFilters(): Promise<void> {
    // let selectedFilters: SelectedFilter[] = [];
    this.selectedFilters = [];
    for (let fc of this.params.filterConfigs) {
      if (this.filters[fc.name] != null && this.filters[fc.name] != '') {
        const displayValue = await this.getFilterDisplayValue(fc, this.filters[fc.name]);
        if (displayValue == null || displayValue === '') {
          continue;
        }
        this.selectedFilters.push({
          label: fc.label,
          value: displayValue,
          name: fc.name
        });
      }
    }
    this.cdr.markForCheck();
    // return selectedFilters;
  }

  private async getFilterDisplayValue(fc: FilterConfig, value: any): Promise<string> {
    if (fc.type == FilterType.DATE_RANGE) {
      if (!value || (!value.start && !value.end)) {
        return '';
      }
      let startStr = value.start ? `${value.start.year}/${value.start.month}/${value.start.day}` : '';
      let endStr = value.end ? `${value.end.year}/${value.end.month}/${value.end.day}` : '';
      const result = `${startStr} - ${endStr}`.trim();
      return result === '-' ? '' : result;
    } else if (fc.type == FilterType.DATE) {
      if (!value) {
        return '';
      }
      return value.year + '/' + value.month + '/' + value.day;
    } else if (fc.type == FilterType.TOGGLE) {
      return value ? 'بله' : 'خیر';
    } else if (fc.type == FilterType.SELECT) {
      if (fc.values) {
        const options = await firstValueFrom(fc.values);
        const option = options?.find(o => o.key === value);
        return option ? option.value : value;
      }
      return value;
    } else if (fc.type == FilterType.MULTI_SELECT) {
      if (fc.values) {
        const options = await firstValueFrom(fc.values);
        const labels: string[] = [];
        for (let val of value) {
          const option = options?.find(o => o.key === val);
          if (option)
            labels.push(option.value);
          else
            labels.push(val);
        }
        return labels.join(', ');
      }
      return Array.isArray(value) ? value.join(', ') : value;
    } else {
      return value;
    }
  }

}



