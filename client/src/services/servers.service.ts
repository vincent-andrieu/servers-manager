import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

import { Server } from "core";

@Injectable({
    providedIn: 'root'
})
export class ServersService {

    constructor(private _socket: Socket) {}

    public listenServers() {
        return this._socket.fromEvent<Array<Server>>('servers');
    }

}