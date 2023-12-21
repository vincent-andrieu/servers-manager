import { Scope } from "@oauth-everything/passport-discord";
import passport from "passport";
import { Profile, Strategy } from "passport-discord";
import { VerifyCallback } from "passport-oauth2";
import { env, nextTick } from "process";

import UserSchema from "@schemas/userSchema";
import { User } from "core";
import { isUserWhitelisted } from "./setupPassport";

async function authentification(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
    if (!profile.id)
        return done(new Error("Discord id not found"));
    if (!profile.verified)
        return done(null, undefined, { message: "Discord account not verified" });
    if (!profile.mfa_enabled)
        return done(null, undefined, { message: "Discord account not secured" });
    if (!isUserWhitelisted(profile.id))
        return done(null, undefined, { message: "Discord account not whitelisted" });
    const userSchema = new UserSchema();
    let user = await userSchema.findByDiscordId(profile.id);

    try {
        if (!user)
            user = await userSchema.add(new User({
                auth: {
                    sources: {
                        discord: {
                            registrationDate: new Date(),
                            id: profile.id
                        }
                    }
                }
            }));
        else if (user._id && !user.auth?.sources.discord)
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

        if (!user._id)
            return done(null, undefined, { message: "Invalid user id" });
        done(null, { _id: user._id } as User);
    } catch (error) {
        done(error as Error);
    }
}

nextTick(() => {
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET)
        throw new Error("Invalid discord config");

    passport.use("discord", new Strategy({
        clientID: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
        callbackURL: "/auth/discord/callback",
        scope: [Scope.IDENTIFY, Scope.EMAIL]
    }, authentification));
});