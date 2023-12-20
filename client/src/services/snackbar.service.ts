import { isPlatformServer } from "@angular/common";
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private readonly _platformId = inject(PLATFORM_ID);

    constructor(private _matSnackBar: MatSnackBar) {}

    public open(message: string): MatSnackBarRef<TextOnlySnackBar> | void {
        if (isPlatformServer(this._platformId))
            return;
        return this._matSnackBar.open(message);
    }

    public openError(error?: HttpErrorResponse): void {
        if (isPlatformServer(this._platformId))
            return;
        console.error(error);
        let message = "Server error";

        if (error?.status === 404)
            message = "Not found";
        else if (typeof error?.error === 'string')
            message = error.error;
        else if (typeof error?.error?.message === 'string')
            message = error.error.message;
        else if (typeof error?.error?.text === 'string')
            message = error.error.text;
        this._matSnackBar.open(message, undefined, { panelClass: 'snackbar-error' });
    }

    public openCustomError(message: string): MatSnackBarRef<TextOnlySnackBar> | void {
        if (isPlatformServer(this._platformId))
            return;
        return this._matSnackBar.open(message, undefined, { panelClass: 'snackbar-error' });
    }
}