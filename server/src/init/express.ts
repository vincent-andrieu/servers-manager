import cors from "cors";
import express, { Express, Request } from "express";
import session from "express-session";
import http from "http";
import passport from "passport";
import { env } from "process";
import { Server, Socket } from "socket.io";

import { User as MyUser } from "core";

import { ExtendedError } from "socket.io/dist/namespace";
import "../passport/discordPassport";
import "../passport/setupPassport";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends Omit<MyUser, "auth"> {}
    }
}

export default class HttpServer {
    private readonly _expressPort = env.PORT ? Number(env.PORT) : undefined;
    private readonly _socketPort = env.SOCKET_PORT ? Number(env.SOCKET_PORT) : undefined;
    private readonly _clientUrl = env.CLIENT_URL;

    private _app: Express | undefined;
    private _io: Server | undefined;
    private _expressSession: express.RequestHandler;

    constructor() {
        const passportSessionSecret = env.PASSPORT_SESSION_SECRET;

        if (!this._expressPort || isNaN(this._expressPort))
            throw new Error("PORT environment variable not found");
        if (!this._socketPort || isNaN(this._socketPort))
            throw new Error("SOCKET_PORT environment variable not found");
        if (!passportSessionSecret)
            throw new Error("PASSPORT_SESSION_SECRET environment variable not found");
        if (!this._clientUrl)
            throw new Error("CLIENT_URL environment variable not found");

        this._expressSession = session({
            secret: passportSessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000
            }
        });
    }

    get app(): Express {
        if (!this._app)
            throw new Error("Express app not initialized");

        return this._app;
    }

    get io(): Server {
        if (!this._io)
            throw new Error("Socket server not initialized");

        return this._io;
    }

    initExpress(): Promise<void> {
        return new Promise((resolve) => {
            this._app = express();

            this._app.use(express.json());

            // Passport middlewares
            this._app.use(this._expressSession);
            this._app.use(passport.initialize());
            this._app.use(passport.session());

            this._app.use(cors({
                origin: this._clientUrl,
                credentials: true
            }));

            this._app.listen(this._expressPort, () => {
                console.info(`App listening on port ${this._expressPort} !`);
                resolve();
            });
        });
    }

    initSockets(): Promise<void> {
        const server = http.createServer(this.app);

        this._io = new Server(server, {
            cors: {
                origin: this._clientUrl,
                credentials: true
            }
        });
        return new Promise<void>((resolve) => {
            server.listen(this._socketPort, () => {
                console.info(`Sockets are listening on port ${this._socketPort} !`);
                const wrap = (middleware: any) => (socket: Socket, next: (err?: ExtendedError | undefined) => void) =>
                    middleware(socket.request, {}, next);

                this.io
                    .use(wrap(this._expressSession))
                    .use(wrap(passport.initialize()))
                    .use(wrap(passport.session()))
                    .use((socket, next) => {
                        if ((socket.request as Request).isAuthenticated())
                            next();
                        else
                            next(new Error("User not authenticated"));
                    });

                resolve();
            });
        });
    }
}