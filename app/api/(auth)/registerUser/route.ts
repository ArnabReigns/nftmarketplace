import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/model/user";

export async function POST(request: NextRequest) {
    try {
        const { name, bio, address } = await request.json();

        if (!name || !address) {
            return NextResponse.json({ error: "Name and address are required." }, { status: 400 });
        }

        await connectToDatabase();

        const newUser = new User({
            name,
            bio,
            address,
        });

        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

