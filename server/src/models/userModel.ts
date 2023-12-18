import mongoose from "mongoose";

import { User } from "core";

const userSchema = new mongoose.Schema<User>({
    auth: {
        sources: {
            discord: {
                registrationDate: { type: Date, required: true, select: false },
                id: { type: String, required: true, unique: true, select: false }
            }
        }
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

export default userSchema;