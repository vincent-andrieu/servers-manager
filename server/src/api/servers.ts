import { Express } from "express";
import { Server as IOServer } from "socket.io";

import DockerService from "@services/dockerService";
import { Server } from "core";
import TemplateRoutes from "./templateRoutes";

export default class ServersRoutes extends TemplateRoutes {

    private readonly _dockerService = new DockerService();

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

        const events = await this._dockerService.listenContainersEvents();

        events.subscribe(async () => {
            const servers = await this._dockerService.containerList();

            this._io?.emit("servers", servers);
        });
    }
}