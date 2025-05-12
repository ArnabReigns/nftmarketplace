import type { NextConfig } from "next";

const nextConfig: NextConfig = {

	eslint: {
		ignoreDuringBuilds: true,
	},
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
