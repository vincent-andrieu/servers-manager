import { Express } from "express";
import { Server as IOServer } from "socket.io";

import DockerService from "@services/dockerService";
import TemplateRoutes from "./templateRoutes";

export default class ServersRoutes extends TemplateRoutes {

    constructor(app: Express, io: IOServer) {
        super(app, io);

        this._initExpress();
        this._initSockets();
    }

    private _initExpress() {}

    private async _initSockets() {
        if (!this._io)
            throw new Error("Socket server not initialized");

        const dockerService = new DockerService();
        const events = await dockerService.listenContainersEvents();

        events.subscribe(async () => {
            const servers = await dockerService.containerList();

            this._io?.emit("servers", servers);
        });
    }
}