import cors from "cors";
import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import { env } from "process";

import { User as MyUser } from "core";

import "../passport/discordPassport";
import "../passport/setupPassport";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends Omit<MyUser, "auth"> {}
    }
}

export default function initExpress(): Promise<Express> {
    const PORT = env.PORT ? Number(env.PORT) : undefined;

    if (!PORT)
        throw new Error("PORT environment variable not found");
    return new Promise((resolve) => {
        const app = express();

        app.use(express.json());

        // Passport middlewares
        const passportSessionSecret = env.PASSPORT_SESSION_SECRET;

        if (!passportSessionSecret)
            throw new Error("PASSPORT_SESSION_SECRET environment variable not found");
        app.use(session({
            secret: passportSessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000
            }
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(cors({
            origin: env.CLIENT_URL,
            credentials: true
        }));

        app.listen(PORT, () => {
            console.info(`App listening on port ${PORT} !`);
            resolve(app);
        });
    });
}