import mongoose, { Document, Schema } from "mongoose";

export interface IListing extends Document {
    listingId: number;
    nftContract: string;
    tokenId: string;
    seller: string;
    price: string;
    status: string; // e.g., "active", "sold", "cancelled"
    createdAt: Date;
    updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
    {
        listingId: {
            type: Number,
            required: true,
            unique: true,
        },
        nftContract: {
            type: String,
            required: true,
        },
        tokenId: {
            type: String,
            required: true,
        },
        seller: {
            type: String,
            required: true,
        },
        price: {
            type: String, // Store price as a string to avoid precision issues
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "sold", "cancelled"],
            default: "active",
        },
    },
    {
        timestamps: true, // automatically manage createdAt and updatedAt fields
    }
);

export const Listing = mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);

