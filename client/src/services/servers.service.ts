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

    public async startServer(id: string): Promise<void> {
        await lastValueFrom(this._http.post(`/servers/${id}/start`, null, { withCredentials: true, responseType: 'text' }));
    }

    public async stopServer(id: string) {
        await lastValueFrom(this._http.post(`/servers/${id}/stop`, null, { withCredentials: true, responseType: 'text' }));
    }

    public async restartServer(id: string) {
        await lastValueFrom(this._http.post(`/servers/${id}/restart`, null, { withCredentials: true, responseType: 'text' }));
    }

    public getServerLogs(serverId: string) {
        return this._http.get<Array<string>>(`/servers/${serverId}/logs`, { withCredentials: true });
    }

    public listenServerLogs(serverId: string) {
        return this._socket.fromEvent<string>('server-logs:' + serverId);
    }

}