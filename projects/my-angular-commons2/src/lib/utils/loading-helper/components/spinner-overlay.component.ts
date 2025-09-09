import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner-overlay',
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner-overlay.component.html',
  styleUrls: ['./spinner-overlay.component.css'],
})
export class SpinnerOverlayComponent {
  constructor() {}
}