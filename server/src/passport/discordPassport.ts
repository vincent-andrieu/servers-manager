import { Scope } from "@oauth-everything/passport-discord";
import { MongooseError } from "mongoose";
import passport from "passport";
import { Profile, Strategy } from "passport-discord";
import { VerifyCallback } from "passport-oauth2";
import { env, nextTick } from "process";

import UserSchema from "@schemas/userSchema";
import { User } from "core";

async function loginAuthentification(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
    if (!profile.id)
        return done(new Error("Discord id not found"));
    if (!profile.verified)
        return done(null, undefined, { message: "Discord account not verified" });
    const userSchema = new UserSchema();
    const user = await userSchema.findByDiscordId(profile.id);

    try {
        if (!user)
            return done(null, undefined, { message: "User not found" });
        if (!user._id)
            return done(null, undefined, { message: "Invalid user id" });
        if (!user.auth?.sources.discord)
            userSchema.updateById(user._id, new User({
                auth: {
                    sources: {
                        discord: {
                            registrationDate: new Date(),
                            id: profile.id
                        }
                    }
                }
            }));

        done(null, { _id: user._id } as User);
    } catch (error) {
        done(error as Error);
    }
}

async function registerAuthentification(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
    if (!profile.id)
        return done(new Error("Discord id not found"));
    if (!profile.verified)
        return done(null, undefined, { message: "Discord account not verified" });

    try {
        const user = await new UserSchema().add(new User({
            auth: {
                sources: {
                    discord: {
                        registrationDate: new Date(),
                        id: profile.id
                    }
                }
            }
        }));

        done(null, { _id: user._id } as User);
    } catch (error) {
        if ((error as MongooseError & { code?: number }).code === 11000)
            done(null, undefined, { message: "User already exists" });
        done(error as Error);
    }
}

nextTick(() => {
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET)
        throw new Error("Invalid discord config");

    passport.use("discord-login", new Strategy({
        clientID: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
        callbackURL: "/auth/discord/login/callback",
        scope: [Scope.IDENTIFY, Scope.EMAIL]
    }, loginAuthentification));
    passport.use("discord-register", new Strategy({
        clientID: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
        callbackURL: "/auth/discord/register/callback",
        scope: [Scope.IDENTIFY, Scope.EMAIL]
    }, registerAuthentification));
});