import mongoose, { Document, Schema } from "mongoose";
import { IToken } from "./nft";


export interface IUser extends Document {
    name: string;
    profilePhoto: string;
    bio: string;
    address: string;
    activity: [String];
}

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        profilePhoto: {
            type: String, required: true, default: () => {
                const seed = Math.random().toString(36).substring(2, 12);
                return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
            }
        },
        bio: {
            type: String,
            required: true,
            default: "I'm just getting started on my NFT journey. This is where you'll find my favorite collectibles, creations, and marketplace activity. Stay tuned — more to come soon!",
        },
        address: { type: String, required: true, unique: true },
        activity: [String],
    },
    {
        timestamps: true,
    }
);


UserSchema.index({ address: 1 }, { unique: true });

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
