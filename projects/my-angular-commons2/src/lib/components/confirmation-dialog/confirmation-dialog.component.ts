import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit(): void {
  }

  confirmMessage: String = "";

  showCancelButton = true;

  title = "تایید عملیات";

}
