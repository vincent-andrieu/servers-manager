import 'dotenv/config';
import "module-alias/register.js";

import HealthRoutes from "@api/health";
import initDatabase from "./init/database";
import initExpress from "./init/express";
import AuthentificationMiddleware from "./middlewares/authentification";
import { errorLoggerMiddleware, loggerMiddleware } from "./middlewares/logger";

async function main() {
    console.log("Server starting...");
    initDatabase();
    const app = await initExpress();
    const authentificationMiddleware = new AuthentificationMiddleware();

    // Middlewares
    app.use(loggerMiddleware);
    app.use(authentificationMiddleware.handler.bind(authentificationMiddleware));

    // Routes
    new HealthRoutes(app, authentificationMiddleware.whitelistRoute);

    // Error middlewares
    app.use(errorLoggerMiddleware);
}

main();