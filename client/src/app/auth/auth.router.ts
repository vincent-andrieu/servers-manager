import { ActivatedRouteSnapshot, Route, Router } from "@angular/router";

import { inject } from "@angular/core";
import { SnackbarService } from "@services/snackbar.service";
import { AuthLoginComponent } from "./login/login.component";

export const authRouter: Route = {
    path: 'auth',
    children: [
        {
            path: '',
            component: AuthLoginComponent
        },
        {
            path: 'success',
            redirectTo: '/'
        },
        {
            path: 'failure',
            component: AuthLoginComponent,
            canActivate: [
                (route: ActivatedRouteSnapshot) => {
                    const router = inject(Router);
                    const snackbarService = inject(SnackbarService);

                    snackbarService.openCustomError(route.queryParamMap.get('message') || 'Erreur de connexion');
                    return router.parseUrl('/auth');
                }
            ]
        }
    ]
};