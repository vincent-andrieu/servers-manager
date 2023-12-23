import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

import { HttpClient } from "@angular/common/http";
import { Server } from "core";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ServersService {

    constructor(private _http: HttpClient, private _socket: Socket) {}

    public getServers() {
        return this._http.get<Array<Server>>('/servers', { withCredentials: true });
    }

    public listenServers() {
        return this._socket.fromEvent<Array<Server>>('servers');
    }

    public startServer(id: string): Promise<void> {
        return lastValueFrom(this._http.post<void>(`/servers/${id}/start`, null, { withCredentials: true }));
    }

    public stopServer(id: string) {
        return lastValueFrom(this._http.post<void>(`/servers/${id}/stop`, null, { withCredentials: true }));
    }

    public restartServer(id: string) {
        return lastValueFrom(this._http.post<void>(`/servers/${id}/restart`, null, { withCredentials: true }));
    }

}