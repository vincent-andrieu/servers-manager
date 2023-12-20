import { Express, Request, Response } from "express";
import passport, { AuthenticateOptions } from "passport";

import { RouteWhitelister } from "@middlewares/authentification";
import TemplateRoutes from "./templateRoutes";

export default class AuthRoutes extends TemplateRoutes {
    private readonly _defaultAuthenticateOptions: Readonly<AuthenticateOptions> = {
        failureRedirect: "/auth/failure",
        successRedirect: this._clientUrl + "/auth/success",
        failureMessage: true
    };

    constructor(app: Express, routeWhitelister: RouteWhitelister) {
        super(app);

        this._init();

        routeWhitelister("/auth/failure");
        routeWhitelister("/auth/discord");
    }

    private _init() {

        this._route("get", "/auth", (_, res: Response) => res.sendStatus(200));

        this._route("get", "/auth/failure", (req: Request, res: Response) => {
            res.redirect(this._clientUrl + "/auth/failure?message=" + (req.session as unknown as { messages: Array<string> }).messages[0]);
        });

        this._route("post", "/auth/logout", (req, res, next) =>
            req.logout((error) => {
                if (error)
                    return next(error);
                res.sendStatus(200);
            })
        );

        this._route("get", "/auth/discord", passport.authenticate("discord"));
        this._route("get", "/auth/discord/callback", passport.authenticate("discord", this._defaultAuthenticateOptions));
    }
}