import { Express } from "express";
import { Server as IOServer } from "socket.io";

import DockerService from "@services/dockerService";
import { Server } from "core";
import TemplateRoutes from "./templateRoutes";

export default class ServersRoutes extends TemplateRoutes {

    private readonly _dockerService = new DockerService();
    private _serversLogs: Record<string, boolean> = {};

    constructor(app: Express, io: IOServer) {
        super(app, io);

        this._initExpress();
        this._initSockets();
    }

    private _initExpress() {
        this._route<never, Array<Server>>("get", "/servers", async (_, res) => {
            const server = await this._dockerService.containerList();

            res.send(server);
        });

        this._route<never, Array<string>>("get", "/servers/:id/logs", async (req, res) => {
            const logs = await this._dockerService.containerLogs(req.params.id);

            res.send(logs);
        });

        this._route<never, void>("post", "/servers/:id/start", async (req, res) => {
            await this._dockerService.containerStart(req.params.id);

            res.sendStatus(200);
        });

        this._route<never, void>("post", "/servers/:id/stop", async (req, res) => {
            await this._dockerService.containerStop(req.params.id);

            res.sendStatus(200);
        });

        this._route<never, void>("post", "/servers/:id/restart", async (req, res) => {
            await this._dockerService.containerRestart(req.params.id);

            res.sendStatus(200);
        });
    }

    private async _initSockets() {
        if (!this._io)
            throw new Error("Socket server not initialized");

        this._listenEvents();
    }

    private async _listenEvents() {
        const events = await this._dockerService.listenContainersEvents();

        events.subscribe(async () => {
            const servers = await this._dockerService.containerList();

            this._io?.emit("servers", servers);
            servers.forEach((server) => {
                if (!this._serversLogs[server.id] && server.state === "running")
                    this._listenServerLogs(server.id);
            });
        });
    }

    private async _listenServerLogs(serverId: string) {
        const logs = await this._dockerService.listenServerLogs(serverId);

        this._serversLogs[serverId] = true;
        logs.subscribe({
            next: (log) => {
                if (this._serversLogs[serverId])
                    this._io?.emit("server-logs:" + serverId, log);
            },
            complete: () => {
                this._serversLogs[serverId] = false;
            },
            error: () => {
                this._serversLogs[serverId] = false;
            }
        });
    }
}