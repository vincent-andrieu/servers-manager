import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

    constructor(
        @Inject('BASE_API_URL') private readonly _baseUrl: string) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiRequest = request.clone({ url: `${this._baseUrl}${request.url.startsWith('/') ? "" : "/"}${request.url}` });

        return next.handle(apiRequest);
    }
}