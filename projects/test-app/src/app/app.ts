import { Component, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { MyGridComponent, CrudParams } from 'my-angular-commons2';

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
    // this.gridParams
  }
}
