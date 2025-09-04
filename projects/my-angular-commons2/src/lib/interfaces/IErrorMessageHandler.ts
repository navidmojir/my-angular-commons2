import { HttpErrorResponse } from "@angular/common/http";

export class ErrorDto {
    message: any;
    details: any;
}

export interface IErrorTranslator {
    translate(errorEnum: string): string;
}

export interface IErrorMessageHandler {
    handle(error: HttpErrorResponse): any;
    translate(error: HttpErrorResponse): ErrorDto;
    setErrorTranslator(errorTranslator: IErrorTranslator): void;
}