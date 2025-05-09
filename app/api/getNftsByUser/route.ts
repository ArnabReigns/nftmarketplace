// app/api/getNftsByUser/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

// Define types based on the response structure
export type NftResponse = {
  nfts: Nft[];
  next: string;
};

export type Nft = {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
};

// App Router-compatible GET handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required." },
      { status: 400 }
    );
  }

  try {
    const options = {
      method: "GET",
      url: `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${address}/nfts`,
      headers: {
        accept: "application/json",
        "x-api-key": process.env.OPENSEA_API_KEY!,
      },
    };

    const response = await axios.request(options);
    const data: NftResponse = response.data;

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch NFTs." },
      { status: 500 }
    );
  }
}
