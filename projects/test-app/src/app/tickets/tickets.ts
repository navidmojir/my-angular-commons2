import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyGridComponent, CrudParams, FieldConfig, CustomAction} from 'my-angular-commons2';

@Component({
  selector: 'app-tickets',
  imports: [MyGridComponent],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets {
gridParams: CrudParams = new CrudParams();

  constructor(private router: Router) {

  }

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
    
  }
}
