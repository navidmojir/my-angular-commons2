import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianDate'
})
export class PersianDatePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if(value == null)
			return '-'; 
		return value.year + '/' + value.month + '/' + value.day;
	}

}

