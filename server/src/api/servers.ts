import { Express } from "express";

import DockerService from "@services/dockerService";
import { Server } from "core";
import TemplateRoutes from "./templateRoutes";

export default class ServersRoutes extends TemplateRoutes {

    constructor(app: Express) {
        super(app);

        this._init();
    }

    private _init() {
        this._route<never, Array<Server>>("get", "/servers", async (_, res) => {
            const server = await new DockerService().containerList();

            res.send(server);
        });
    }
}