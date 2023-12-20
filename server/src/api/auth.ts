import { Express, Request, Response } from "express";
import passport, { AuthenticateOptions } from "passport";

import { RouteWhitelister } from "@middlewares/authentification";
import TemplateRoutes from "./templateRoutes";

export default class AuthRoutes extends TemplateRoutes {
    private readonly _defaultLoginAuthenticateOptions: Readonly<AuthenticateOptions> = {
        failureRedirect: "/auth/login/failure",
        successRedirect: this._clientUrl + "/auth/login/success",
        failureMessage: true
    };
    private readonly _defaultRegisterAuthenticateOptions: Readonly<AuthenticateOptions> = {
        failureRedirect: "/auth/register/failure",
        successRedirect: this._clientUrl + "/auth/register/success",
        failureMessage: true
    };

    constructor(app: Express, routeWhitelister: RouteWhitelister) {
        super(app);

        this._init();

        routeWhitelister("/auth/login/failure");
        routeWhitelister("/auth/register/failure");
        routeWhitelister("/auth/discord");
    }

    private _init() {

        this._route("get", "/auth", (_, res: Response) => res.sendStatus(200));

        this._route("get", "/auth/login/failure", (req: Request, res: Response) => {
            res.redirect(this._clientUrl + "/auth/login/failure?failure=" + (req.session as unknown as { messages: Array<string> }).messages[0]);
        });
        this._route("get", "/auth/register/failure", (req: Request, res: Response) => {
            res.redirect(this._clientUrl + "/auth/register/failure?failure=" + (req.session as unknown as { messages: Array<string> }).messages[0]);
        });

        this._route("post", "/auth/logout", (req, res, next) =>
            req.logout((error) => {
                if (error)
                    return next(error);
                res.sendStatus(200);
            })
        );

        this._route("get", "/auth/discord/login", passport.authenticate("discord-login"));
        this._route("get", "/auth/discord/login/callback", passport.authenticate("discord-login", this._defaultLoginAuthenticateOptions));

        this._route("get", "/auth/discord/register", passport.authenticate("discord-register"));
        this._route("get", "/auth/discord/register/callback", passport.authenticate("discord-register", this._defaultRegisterAuthenticateOptions));
    }
}