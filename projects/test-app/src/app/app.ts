import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyGridComponent } from 'my-angular-commons2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyGridComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test-app');
}
