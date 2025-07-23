import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SnackbarHelperService } from '../snackbar-helper/snackbar-helper.service';
import { IErrorMessageHandler } from '../../interfaces/IErrorMessageHandler';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = "http://localhost:8080/";
  private resourceName = "entities";
  private errorMsgHandler: IErrorMessageHandler | null = null;
  private searchMethod = "/search";

  constructor(private httpClient: HttpClient,
		private snackBar: SnackbarHelperService) { }

  public list(filters: any, paging: any, sorting: any): any {
	// let params: any = {};
	// if(sorting != null && sorting.hasOwnProperty('sortField'))
	// 	params.sortField = sorting.sortField;
	// if(sorting != null && sorting.hasOwnProperty('ascending'))
	// 	params.ascending = sorting.ascending;
	// if(paging != null && paging.hasOwnProperty('pageNumber'))
	// 	params.currentPage = paging.pageNumber;
	// if(paging != null && paging.hasOwnProperty('pageSize'))
	// 	params.pageSize = paging.pageSize;
    //console.log("Getting list of data from backend. ", this.baseUrl, this.resourceName);
	let req = {
		filters: filters,
		paging: paging,
		sorting: sorting
	};
    return this.httpClient.post(this.baseUrl + this.resourceName + this.searchMethod, 
		req, {observe: 'response'}).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  public create(entity: any): any {
    return this.httpClient.post(this.baseUrl + this.resourceName, entity).pipe(
		catchError((error) => this.handleError(error))
	  );
  }

  public retrieve(id: any): any {
    return this.httpClient.get(this.baseUrl + this.resourceName + "/" + id).pipe(
		catchError((error) => this.handleError(error))
	  );
  }

  public delete(id: any): any {
    return this.httpClient.delete(this.baseUrl + this.resourceName + "/" + id).pipe(
		catchError((error) => this.handleError(error))
	  );
  }

  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  public setResourceName(resourceName: string): void {
    this.resourceName = resourceName;
  }

  public setSearchMethod(searchMethod: string): void {
    this.searchMethod = searchMethod;
  }

  public update(id:any, entity: any): any {
    return this.httpClient.put(this.baseUrl + this.resourceName + "/" + id, entity).pipe(
		catchError((error: any) => this.handleError(error))
	  );
  }

  public setErrorMsgHandler(handler: IErrorMessageHandler | null)
  {
	  this.errorMsgHandler = handler;
  }

  private handleError(error: HttpErrorResponse) {
		// let errorMessage = '';
		// console.log(error);
		// if(error.status == 0)
		// 	errorMessage = 'خطا در برقراری ارتباط با سرور';
		// // else if (error.status == 401)
		// // 	errorMessage = 'احراز هویت با خطا مواجه شده است';
		// // else if (error.status == 403)
		// // 	errorMessage = 'مجوز دسترسی به سرویس مورد نظر وجود ندارد.';
		// // else if (error.status == 404)
		// // 	errorMessage = 'سرویس مورد نظر یافت نشد';
		// else
		// {
			if(this.errorMsgHandler == null)
				console.log('مدیریت خطا به درستی تنظیم نشده است');
			else
				return this.errorMsgHandler.handle(error);
		// }
		// this.snackBar.open(errorMessage, 'بستن');
		// return throwError(error);		
	}

}
