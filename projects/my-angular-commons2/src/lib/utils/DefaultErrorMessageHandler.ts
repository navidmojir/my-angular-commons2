import { HttpErrorResponse } from "@angular/common/http";
import { ErrorDto, IErrorMessageHandler, IErrorTranslator } from "../interfaces/IErrorMessageHandler";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from "../components/error-dialog/error-dialog.component";
import { throwError } from 'rxjs';
import { inject, Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class DefaultErrorMessageHandler implements IErrorMessageHandler {

    private dialog: MatDialog = inject(MatDialog);

    private errorTranslator: IErrorTranslator | null = null;

    handle(error: HttpErrorResponse) {
        try {
            console.log(error);
            let errorDto: ErrorDto;
            
            errorDto = this.translate(error);

            let dialogRef: MatDialogRef<ErrorDialogComponent> = this.dialog.open(ErrorDialogComponent);
            dialogRef.componentInstance.error = errorDto;
            return throwError(error);	
        }
        catch(e)
        {
            console.log(e);
            return throwError(e);	
        }
    }

    translate(httpErrorResponse: HttpErrorResponse): ErrorDto {
        switch(httpErrorResponse.status) {
            
        case 401: 
            return {message: "لطفا لاگین نمایید.", details: "Unauthorized access. Please login."}
        case 403:
            return {message: "شما به سرویس مورد نظر دسترسی ندارید", details: "Forbidden Access to target " + httpErrorResponse?.error?.currentTarget?.__zone_symbol__xhrURL}
        case 0:
            return {message:'خطا در برقراری ارتباط با سرور', details: 'Failed to communicate with backend.'};
        }
            
        if(httpErrorResponse == undefined || httpErrorResponse.error == undefined 
                || httpErrorResponse.error['error'] == undefined)
            return {message: 'خطای نامشخص', 
                details:'Response body received from backend is empty. So detecting error is impossible. HTTP status code is ' + httpErrorResponse.status};

            let message = '';
        let errorEnum = httpErrorResponse.error.error;
        switch(errorEnum)
        {
        case 'INTERNAL_ERROR':
        case 'Internal Server Error':
            message =  'خطای داخلی در سرویس رخ داده است';
            break;
        case 'ENTITY_NOT_FOUND':
            message = 'موجودیت درخواست شده در پایگاه داده یافت نشد';
            break;
        case 'Not Found': //spring boot
            message = 'یافت نشد';
            break;
        case 'INVALID_INPUT':
            message = 'داده های ورودی معتبر نیست'; 
            break;
        default:
            if(this.errorTranslator != null)
                message = this.errorTranslator.translate(errorEnum);
            else
                message = 'ترجمه کد خطا یافت نشد. کد خطا: ' + httpErrorResponse.error.error;
            break;
        }
        
        return {message: message, details: httpErrorResponse.error.message};
    }

    public setErrorTranslator(errorTranslator: IErrorTranslator) {
        this.errorTranslator = errorTranslator;
    }
    
}