import { isPlatformBrowser } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ServersService } from "@services/servers.service";
import { SnackbarService } from "@services/snackbar.service";
import { Server, ServerState } from "core";

type ServerMainButtonAction = "start" | "stop" | "restart";

const SERVER_MAIN_BUTTON: Record<ServerState, {
    action?: ServerMainButtonAction,
    label: string,
    color: string
}> = {
    created: {
        action: "start",
        label: "Démarrer",
        color: "green"
    },
    exited: {
        action: "start",
        label: "Démarrer",
        color: "green"
    },
    running: {
        action: "restart",
        label: "Redémarrer",
        color: "warn"
    },
    paused: {
        label: "En pause",
        color: "primary"
    },
    restarting: {
        label: "Redémarrage",
        color: "accent"
    },
    removing: {
        label: "Suppression",
        color: "accent"
    },
    dead: {
        label: "DEAD",
        color: "accent"
    }
};

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

    public servers: Array<Server> = [];
    public readonly serverMainButton = SERVER_MAIN_BUTTON;

    private readonly _platformId = inject(PLATFORM_ID);

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _serversService: ServersService,
        private _snackbarService: SnackbarService
    ) {
        if (isPlatformBrowser(this._platformId))
            this._serversService.listenServers().subscribe((servers) => this.servers = servers);
    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe(({ servers }) => this.servers = servers);
    }

    public async handleServerAction(server: Server, action: ServerMainButtonAction): Promise<void> {
        try {
            switch (action) {
            case "start":
                await this._serversService.startServer(server.id);
                break;
            case "stop":
                await this._serversService.stopServer(server.id);
                break;
            case "restart":
                await this._serversService.restartServer(server.id);
                break;
            }
        } catch (error) {
            this._snackbarService.openError(error as HttpErrorResponse);
        }
    }

}