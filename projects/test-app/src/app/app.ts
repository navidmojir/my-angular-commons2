import { Component, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MyGridComponent, CrudParams, FieldConfig} from 'my-angular-commons2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyGridComponent, MatSlideToggleModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('test-app');

  gridParams: CrudParams = new CrudParams();

  ngOnInit() {
    this.gridParams.baseUrl = "http://localhost:8081/";
    this.gridParams.resourceName = "tickets";
    
    let idCol = new FieldConfig();
    idCol.name = 'id';
    idCol.displayText = 'شناسه';

    this.gridParams.fieldConfigs.push(idCol);
  }
}
