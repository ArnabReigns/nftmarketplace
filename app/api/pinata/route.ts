import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/pinata.config"; // Your configured Pinata SDK

export async function POST(request: NextRequest) {
  try {
    // Parse incoming form data (file, name, description)
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const name: string = data.get("name") as string;
    const description: string = data.get("description") as string;

    // Step 1: Upload the image to IPFS using Pinata SDK
    if (!file || !name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { cid: imageCid } = await pinata.upload.public.file(file);

    // Convert CID to IPFS URL
    const imageUrl = await pinata.gateways.public.convert(imageCid);

    // Step 2: Create metadata JSON
    const metadata = {
      name: name,
      description: description,
      image: imageUrl, // Image URL is the IPFS URL from Pinata
      attributes: [
        {
          trait_type: "Attribute 1",
          value: "Value 1",
        },
        {
          trait_type: "Attribute 2",
          value: "Value 2",
        },
      ],
      external_url: `https://example.com/${imageCid}`, 
    };

    // Step 3: Upload metadata JSON to IPFS using Pinata SDK
    const { cid: metadataCid } = await pinata.upload.public.json(metadata);

    // Step 4: Convert metadata CID to IPFS URL
    const metadataUri = await pinata.gateways.public.convert(metadataCid);

    // Step 5: Return metadata URI to frontend
    return NextResponse.json({ metadataUri }, { status: 200 });
  } catch (e) {
    console.error("Error during upload:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
