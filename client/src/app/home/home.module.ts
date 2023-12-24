import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";

import { RouterModule } from "@angular/router";
import { environment } from "@environment";
import { HomeComponent } from './home/home.component';
import { ServerLogsComponent } from "./logs/logs.component";

const socketConfig: SocketIoConfig = { url: environment.socketServer, options: { withCredentials: true } };

@NgModule({
    declarations: [
        HomeComponent,
        ServerLogsComponent
    ],
    imports: [
        CommonModule,
        SocketIoModule.forRoot(socketConfig),

        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        RouterModule
    ]
})
export class HomeModule {}