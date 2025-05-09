import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "peach-wrong-meadowlark-825.mypinata.cloud",
			},
		],
	},
};

export default nextConfig;
