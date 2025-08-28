import { Pipe, PipeTransform } from '@angular/core';

// convert epoch to shamsi
@Pipe({
  name: 'jalali'
})
export class JalaliPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if(value == null)
			return '-';
		// let MomentDate = jalaliMoment(new Date(value));
		// return MomentDate.locale('fa').format('YYYY/MM/DD'); 
		return new Intl.DateTimeFormat('fa-IR', {dateStyle: 'short'}).format(new Date(value));
	}

}

@Pipe({
  name: 'jalalitime'
})
export class JalaliTimePipe implements PipeTransform {

	transform(value: any, args?: any): any {		
		if(value == null)
			return '-';
		return new Intl.DateTimeFormat('fa-IR', {dateStyle: 'short', timeStyle: 'short'}).format(new Date(value));
	}

}
