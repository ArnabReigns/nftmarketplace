import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/model/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const address = searchParams.get("address");
        if (!address) {
            return NextResponse.json({ error: "Address parameter is required." }, { status: 400 });
        }
        await connectToDatabase();
        const user = await User.findOne({ address });
        return NextResponse.json(user);
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
