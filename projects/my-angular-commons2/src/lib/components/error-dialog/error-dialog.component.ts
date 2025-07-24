import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ErrorDto } from '../../interfaces/IErrorMessageHandler';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    CommonModule, 
    MatDividerModule, 
    MatIconModule, 
    MatButtonModule,
    MatDialogModule
  ],
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {

  error: ErrorDto  = new ErrorDto();

  showDetails = false;

  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>) { }

  ngOnInit(): void {
  }

  setShowDetails(value: any) {
    this.showDetails = value;
  }



}
