import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { inject, Injectable } from "@angular/core";
import { DefaultErrorMessageHandler } from "../../utils/DefaultErrorMessageHandler";
import { Paging } from "../../dtos/paging";
import { Sorting } from "../../dtos/sorting";
import { IErrorMessageHandler, IErrorTranslator } from "../../interfaces/IErrorMessageHandler";

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    private baseUrl: String = "http://localhost:8080";
    private resourceName: String = "resources";
    private searchMethod = "/search";

    private httpClient: HttpClient = inject(HttpClient);
    private errorMessageHandlerService: IErrorMessageHandler = inject(DefaultErrorMessageHandler);
    

    // constructor(private httpClient: HttpClient,
    //     private errorMessageHandlerService: IErrorMessageHandler,
    //     private resourceName: string) {
        
    // }

    private handleError(error: HttpErrorResponse) {
		return this.errorMessageHandlerService.handle(error);
    }

    public setBaseUrl(baseUrl: string): void {
        this.baseUrl = baseUrl;
    }

    public setSearchMethod(searchMethod: string): void {
        this.searchMethod = searchMethod;
    }

    public setErrorTranslator(errorTranslator: IErrorTranslator) {
        this.errorMessageHandlerService.setErrorTranslator(errorTranslator);
    }

    public setResourceName(resourceName: String) {
        this.resourceName = resourceName;
    }

    public post(path: string, body: any, options?: any) {
        return this.httpClient.post(this.baseUrl + path, body, options).pipe(
              catchError((error) => this.handleError(error))
        );
    }

    public get(path: string, options?: any) {
        return this.httpClient.get(this.baseUrl + path, options).pipe(
            catchError((error) => this.handleError(error))
      );
    }

    public getAsBlob(path: string) {
        return this.httpClient.get(this.baseUrl + path, { responseType: 'blob' as 'json' }).pipe(
            catchError((error) => this.handleError(error))
      );
    }

    public put(path: string, body: any) {
        return this.httpClient.put(this.baseUrl + path, body).pipe(
              catchError((error) => this.handleError(error))
        );
    }

    public patch(path: string, body: any) {
        return this.httpClient.patch(this.baseUrl + path, body).pipe(
              catchError((error) => this.handleError(error))
        );
    }

    public delete(path: string) {
        return this.httpClient.delete(this.baseUrl + path).pipe(
              catchError((error) => this.handleError(error))
        );
    }

    public create(entity: any) {
        return this.post('/' + this.resourceName, entity);
    }

    public retrieve(id: string) {
        return this.get('/' + this.resourceName + '/' + id);
    }

    public update(id: string, entity: any) {
        return this.put('/' + this.resourceName + '/' + id, entity);
    }

    public patchUpdate(id: string, entity: any) {
        return this.patch('/' + this.resourceName + '/' + id, entity);
    }

    public search(filters: any, paging: Paging, sorting: Sorting) {
        let req = {filters: filters, paging: paging, sorting: sorting};
        return this.post('/' + this.resourceName + this.searchMethod, req, {observe: 'response'});
    }

    public remove(id: string) {
        return this.delete('/' + this.resourceName + '/' + id);
    }
}