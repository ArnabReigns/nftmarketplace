// app/api/getNftsByUser/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Token } from "@/model/nft";

// App Router-compatible GET handler
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const address = searchParams.get("address");

	console.log("current profile address => " + address);

	if (!address) {
		return NextResponse.json(
			{ error: "Address parameter is required." },
			{ status: 400 }
		);
	}

	try {
		await connectToDatabase();

		let data = await Token.find({
			$or: [
				{ creator: new RegExp(`^${address}$`, "i") },
				{ owner: new RegExp(`^${address}$`, "i") },
				{ seller: new RegExp(`^${address}$`, "i") },
			],
		});

		console.log(data);

		return NextResponse.json(data);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to fetch NFTs." },
			{ status: 500 }
		);
	}
}
