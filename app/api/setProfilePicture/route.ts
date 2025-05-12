import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/model/user";

export async function POST(request: NextRequest) {
    try {
        const { address, profilePhoto } = await request.json();

        if (!address || !profilePhoto) {
            return NextResponse.json({ error: "Address and profilePhoto are required." }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOneAndUpdate(
            { address },
            { profilePhoto },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile photo updated successfully", user }, { status: 200 });
    } catch (error) {
        console.error("Profile Photo Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

