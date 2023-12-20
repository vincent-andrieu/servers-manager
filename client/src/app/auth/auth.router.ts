import { Route } from "@angular/router";

import { AuthLoginComponent } from "./login/login.component";
// import { AuthRegisterComponent } from "./register/register.component";

export const authRouter: Route = {
    path: 'auth',
    children: [
        {
            path: 'login',
            component: AuthLoginComponent
        }
    ]
};