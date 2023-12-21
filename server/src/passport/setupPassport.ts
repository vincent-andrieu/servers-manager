import passport from "passport";

import UserSchema from "@schemas/userSchema";
import { ObjectId } from "core";
import { env } from "process";

passport.serializeUser<ObjectId>((user: Express.User, done) => {
    done(null, user._id);
});

passport.deserializeUser<ObjectId>(async (userId, done) => {
    try {
        const user = await new UserSchema().get(userId);

        done(null, user);
    } catch(error) {
        done(error);
    }
});

export function isUserWhitelisted(id: string) {
    const whitelistedUsers: Array<string> = env.WHITELISTED_USERS?.split(",") || [];

    return whitelistedUsers.includes(id);
}