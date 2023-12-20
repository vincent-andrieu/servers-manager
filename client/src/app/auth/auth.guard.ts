import { inject } from "@angular/core";
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from "@services/auth.service";

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    try {
        if (await authService.isAuthenticated())
            return true;
        return router.parseUrl('/auth/login');
    } catch (error) {
        return router.parseUrl('/auth/login');
    }
};