import { ValidatorFn, AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

export function nationalCodeValidator(): ValidatorFn {
	return (control: AbstractControl): {[key: string]: any} | null => {
		if (!/^\d{10}$/.test(control.value)) {
			return {'nationalCode': {value: control.value}};
		}

		var check = parseInt(control.value[9]);
		var sum = 0;
		var i;
		for (i = 0; i < 9; ++i) {
			sum += parseInt(control.value[i]) * (10 - i);
		}
		sum %= 11;

		let isValid = (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);

		if(isValid)
			return null;
		else
			return {'nationalCode': {value: control.value}};
	};
}

@Directive({
  selector: '[appNationalCode]',
  providers: [{provide: NG_VALIDATORS, useExisting: NationalCodeValidatorDirective, multi: true}]
})
export class NationalCodeValidatorDirective implements Validator {  
 
	validate(control: AbstractControl): {[key: string]: any} | null {	  
		return nationalCodeValidator()(control);
	}
}