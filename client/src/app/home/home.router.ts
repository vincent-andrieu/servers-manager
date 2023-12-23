import { Route } from "@angular/router";

import { authGuard } from "app/auth/auth.guard";
import serversResolver from "resolvers/servers.resolver";
import { HomeComponent } from "./home/home.component";

export const homeRouter: Route = {
    path: '',
    canActivate: [authGuard],
    component: HomeComponent,
    resolve: {
        servers: serversResolver
    }
};