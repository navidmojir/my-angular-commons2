import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerOverlayService } from './spinner-overlay.service';


export function spinnerInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let spinnerOverlayService: SpinnerOverlayService = inject(SpinnerOverlayService);
    const spinnerSubscription: Subscription = spinnerOverlayService.spinner$.subscribe();
    return next(req).pipe(finalize(() => spinnerSubscription.unsubscribe()));
}