import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service";


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let authService: AuthService = inject(AuthService);
    if(!authService.getAccessToken())
        return next(req);
    const reqWithHeader = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + authService.getAccessToken()),
    });
    return next(reqWithHeader);
}