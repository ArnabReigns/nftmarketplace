// app/api/getNftsByUser/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Token } from "@/model/nft";
import { IListing, Listing } from "@/model/listings";

// App Router-compatible GET handler
export async function GET(req: Request) {

    try {
        await connectToDatabase();

        let data: IListing[] = await Token.find({
            "listingId": { $ne: null }
        })

        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch NFTs." },
            { status: 500 }
        );
    }
}
