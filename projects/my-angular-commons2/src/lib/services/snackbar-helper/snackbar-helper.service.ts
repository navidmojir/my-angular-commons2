import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarHelperService {

  constructor(public snackBar: MatSnackBar) { }

  open(message: string, action: string) {
		this.snackBar.open(message, action, {
		  duration: 10000,
		  direction: 'rtl'
		});
	 }	 
}
