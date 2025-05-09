"use client";

import React, { useEffect, useState } from "react";
import { Nft, NftResponse } from "../../api/getNftsByUser/route";
import { useWallet } from "@/hooks/useWallet";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import Image from "next/image";
import DEFAULT_BG from "@/public/profileDefaultBG.jpg";
import {
	CaretDown,
	ArrowFatLinesDown,
	Copy,
	Globe,
	Pencil,
} from "@phosphor-icons/react/dist/ssr";
import default_user from "@/public/user_default.png";
import { use } from "react";
import FilterTags from "@/components/FilterTags";
import Link from "next/link";
import { NamedFragment } from "ethers";

const page = ({ params }: { params: Promise<{ userAddress: string }> }) => {
	const [nfts, setNfts] = useState<Nft[] | null>(null);

	const { userAddress } = use(params);

	async function fetchUserProfile() {
		try {
			const response = await fetch(
				`/api/getNftsByUser?address=${userAddress}`
			);
			const data: NftResponse = await response.json();

			if (response.ok) {
				setNfts(data.nfts.filter((nft) => nft.image_url));
			}
		} catch (err) {
			console.log("Failed to fetch NFTs. Please try again.");
			console.error(err);
		}
	}

	useEffect(() => {
		console.log("called");
		if (userAddress) {
			fetchUserProfile();
		}
	}, [userAddress]);

	const tabs = ["Nfts", "Listings", "Created", "Watchlist", "Activity"];

	const [activeTab, setActiveTab] = useState(0);

	return (
		<Stack sx={{}}>
			<Box width={"100%"} height={"18rem"} position={"relative"}>
				<Image
					src={DEFAULT_BG}
					alt="profile-bg-default"
					style={{
						height: "100%",
						width: "100%",
						objectFit: "cover",
					}}
				/>
				<Stack
					position={"absolute"}
					bottom={"1rem"}
					left={"1rem"}
					gap={1}
				>
					<Avatar
						src={default_user.src}
						alt="Arnab Chatterjee"
						sx={{ bgcolor: "#DE0374", width: 75, height: 75 }}
					>
						AC
					</Avatar>
					<Box display={"flex"} sx={{}} gap={2} alignItems={"center"}>
						<Typography fontSize={"1.2rem"}>
							{userAddress}
						</Typography>
						<Divider flexItem orientation="vertical" />
						<Pencil
							size={20}
							weight="light"
							style={{ cursor: "pointer" }}
						/>
						<Globe
							size={20}
							weight="light"
							style={{ cursor: "pointer" }}
						/>
						<Copy
							size={20}
							weight="light"
							style={{ cursor: "pointer" }}
						/>
					</Box>
					<Typography
						variant="caption"
						width={"50vw"}
						color="text.secondary"
					>
						I'm just getting started on my NFT journey. This is
						where you'll find my favorite collectibles, creations,
						and marketplace activity. Stay tuned — more to come
						soon!
					</Typography>
				</Stack>
			</Box>

			{/* asdasd */}
			<Box
				sx={{
					zIndex: 1,
					padding: 2,
				}}
			>
				<Stack flexDirection={"row"} gap={3} mt={1}>
					{tabs.map((item, idx) => (
						<Box
							key={idx}
							onClick={() => {
								setActiveTab(idx);
							}}
							sx={{
								cursor: "pointer",
							}}
						>
							<Typography
								color={activeTab == idx ? "white" : "#9d9d9d"}
								fontWeight={activeTab == idx ? "500" : "400"}
							>
								{item}
							</Typography>
						</Box>
					))}
				</Stack>

				<Box mt={2}>{activeTab == 0 && <NFT nfts={nfts} />}</Box>
			</Box>
		</Stack>
	);
};

const NFT = ({ nfts }: { nfts: Nft[] | null }) => {
	return (
		<Box display={"flex"} gap={1}>
			<Box
				sx={{
					width: "20rem",
				}}
			>
				<Accordion>
					<AccordionSummary
						expandIcon={<CaretDown />}
						aria-controls="panel1-content"
						id="panel1-header"
					>
						<Typography component="span">Status</Typography>
					</AccordionSummary>
					<AccordionDetails
						sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
					>
						<FilterTags tag="All" active fontSize={"0.8rem"} />
						<FilterTags tag="Listed" fontSize={"0.8rem"} />
						<FilterTags tag="Not Listed" fontSize={"0.8rem"} />
					</AccordionDetails>
				</Accordion>
				<Accordion disabled>
					<AccordionSummary
						expandIcon={<CaretDown />}
						aria-controls="panel2-content"
						id="panel2-header"
					>
						<Typography component="span">Collection</Typography>
					</AccordionSummary>
					<AccordionDetails>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Suspendisse malesuada lacus ex, sit amet blandit leo
						lobortis eget.
					</AccordionDetails>
				</Accordion>
			</Box>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
				{nfts?.map((nft, idx) => (
					<Box
						key={idx}
						sx={{
							borderRadius: 2,
							overflow: "hidden",
							bgcolor: "#141415",
							borderColor: "#262627",
							borderWidth: 2,
							transition: "transform 0.2s ease-out",
							boxShadow: "0 2px 10px -2px #9f9f9f14",
							":hover": {
								transform: "translateY(-2px)",
							},
						}}
					>
						<Box
							sx={{
								height: "15rem",
								width: "14rem",
								position: "relative",
								cursor: "pointer",
							}}
						>
							<Image
								src={nft.image_url}
								alt={nft.description}
								fill={true}
								objectFit="cover"
							/>
						</Box>
						<Box p={1}>
							<Typography>{nft.name}</Typography>
							<Box display={"flex"} gap={1} mt={2}>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={
										"https://sepolia.etherscan.io/address/" +
										nft.contract
									}
								>
									<Typography
										sx={{
											bgcolor: "#262525",
											border: "1px solid #414040",
											p: 0.2,
											px: 1,
											borderRadius: 2,
											fontSize: "0.9rem",
										}}
									>
										{shortenAddress(nft.contract)}
									</Typography>
								</a>
								<Typography
									sx={{
										bgcolor: "#262525",
										border: "1px solid #414040",
										p: 0.2,
										px: 1,
										borderRadius: 2,
										fontSize: "0.9rem",
									}}
								>
									TOKEN #{nft.identifier}
								</Typography>
							</Box>
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export function shortenAddress(address: string, chars = 4): string {
	if (!address) return "";
	return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export default page;
