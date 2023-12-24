import { Route } from "@angular/router";

import { authGuard } from "app/auth/auth.guard";
import serverLogsResolver from "resolvers/logs.resolver";
import serversResolver from "resolvers/servers.resolver";
import { HomeComponent } from "./home/home.component";
import { ServerLogsComponent } from "./logs/logs.component";

export const homeRouter: Route = {
    path: '',
    canActivate: [authGuard],
    children: [
        {
            path: '',
            pathMatch: 'full',
            component: HomeComponent,
            resolve: {
                servers: serversResolver
            }
        },
        {
            path: ':serverId/logs',
            component: ServerLogsComponent,
            resolve: {
                logs: serverLogsResolver
            }
        }
    ]
};