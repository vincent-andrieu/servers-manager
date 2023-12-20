import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { isPlatformServer } from "@angular/common";
import { environment } from "@environment";
import { SnackbarService } from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _platformId = inject(PLATFORM_ID);

    constructor(private readonly _http: HttpClient, private readonly _snackbarService: SnackbarService) {}

    async isAuthenticated(): Promise<boolean> {
        if (isPlatformServer(this._platformId))
            return false;
        return new Promise<boolean>((resolve, reject) => {
            this._http.get<boolean>('/auth', { withCredentials: true }).subscribe({
                complete() {
                    resolve(true);
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status >= 400 && error.status < 500)
                        resolve(false);
                    else {
                        this._snackbarService.openError(error);
                        reject(error);
                    }
                }
            });
        });
    }

    login() {
        location.href = environment.apiUrl + '/auth/discord/login';
    }

    register() {
        location.href = environment.apiUrl + '/auth/discord/register';
    }

    public async logout(): Promise<void> {
        if (isPlatformServer(this._platformId))
            return;
        return new Promise<void>((resolve, reject) => {
            this._http.put('/auth/logout', undefined, { withCredentials: true }).subscribe({
                complete() {
                    resolve();
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status === 401)
                        resolve();
                    else {
                        this._snackbarService.openError(error);
                        reject(error);
                    }
                }
            });
        });
    }
}