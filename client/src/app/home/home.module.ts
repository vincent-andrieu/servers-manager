import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from "@environment";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { HomeComponent } from './home/home.component';

const socketConfig: SocketIoConfig = { url: environment.socketServer, options: { withCredentials: true } };

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        SocketIoModule.forRoot(socketConfig)
    ]
})
export class HomeModule {}