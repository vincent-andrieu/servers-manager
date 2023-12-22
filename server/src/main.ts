import 'dotenv/config';
import "module-alias/register.js";

import AuthRoutes from "@api/auth";
import HealthRoutes from "@api/health";
import ServersRoutes from "@api/servers";
import initDatabase from "./init/database";
import HttpServer from "./init/express";
import AuthentificationMiddleware from "./middlewares/authentification";
import { errorLoggerMiddleware, loggerMiddleware } from "./middlewares/logger";

async function main() {
    console.log("Server starting...");
    initDatabase();
    const server = new HttpServer();
    const authentificationMiddleware = new AuthentificationMiddleware();

    await Promise.all([server.initExpress(), server.initSockets()]);

    // Middlewares
    server.app.use(loggerMiddleware);
    server.app.use(authentificationMiddleware.handler.bind(authentificationMiddleware));

    // Routes
    new HealthRoutes(server.app, authentificationMiddleware.whitelistRoute);
    new AuthRoutes(server.app, authentificationMiddleware.whitelistRoute);
    new ServersRoutes(server.app, server.io);

    // Error middlewares
    server.app.use(errorLoggerMiddleware);
}

main();