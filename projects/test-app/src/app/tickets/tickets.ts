import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MyGridComponent, CrudParams, FieldConfig, CustomAction, ConfirmationDialogComponent} from 'my-angular-commons2';

@Component({
  selector: 'ticket-search-filters-dialog',
  templateUrl: 'ticket-search-filters-dialog.html',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketSearchFiltersDialog {}


@Component({
  selector: 'app-tickets',
  imports: [MyGridComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets {
  gridParams: CrudParams = new CrudParams();

  @ViewChild(MyGridComponent) grid!: MyGridComponent;

  constructor(private router: Router,
    private dialog: Dialog
  ) {
  }

  filters = new UntypedFormGroup({
    text: new UntypedFormControl()
  });

  ngOnInit() {
    this.gridParams.baseUrl = "http://localhost:8081";
    this.gridParams.resourceName = "tickets";
    
    
    let idCol = new FieldConfig();
    idCol.name = 'id';
    idCol.displayText = 'شناسه';
    this.gridParams.fieldConfigs.push(idCol);

    let textCol = new FieldConfig();
    textCol.name = 'text';
    textCol.displayText = 'متن تیکت';
    this.gridParams.fieldConfigs.push(textCol);

    let createAction = new CustomAction();
    createAction.title = "ایجاد تیکت جدید";
    createAction.onClick = () => this.router.navigate(["ticket-details"]);
    this.gridParams.customGeneralActions.push(createAction);

    let searchAction = new CustomAction();
    searchAction.title = "جستجو";
    searchAction.onClick = () => this.openSearchDialog();
    this.gridParams.customGeneralActions.push(searchAction);

    let showDetailsAction = new CustomAction();
    showDetailsAction.title = 'جزئیات';
    showDetailsAction.onClick = (ticket: any) => this.router.navigate(['ticket-details', ticket.id]);
    this.gridParams.customRecordActions.push(showDetailsAction);
    
  }

  applyFilter() {
    this.grid.reloadFromPageZero();
  }

  openSearchDialog() {
    this.dialog.open(TicketSearchFiltersDialog);
  }

}
