"use client";

import React, { useEffect, useState } from "react";

import DEFAULT_BG from "@/public/profileDefaultBG.jpg";
import default_user from "@/public/user_default.png";
import {
	Avatar,
	Box, Button, ButtonGroup, CircularProgress, Dialog,
	Divider, Fade, IconButton, Skeleton, Slide, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import { Copy, Globe, Pencil, PhosphorLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { use } from "react";

import { useAppContext } from "@/context/AppContext";
import { cmpAddr } from "@/lib/compareAddress";
import { IToken } from "@/model/nft";
import { IUser } from "@/model/user";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Created } from "./(components)/Created";
import { NFT } from "./(components)/NFT";




function Page({ params }: { params: Promise<{ userAddress: string }> }) {
	const [nfts, setNfts] = useState<IToken[] | null>(null);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [name, setName] = useState("");
	const [savingUser, setSavingUser] = useState(false);

	const { address, user: currentUser, setUser: setCurrentUser, userLoading, nftContract: contract, refreshMap } = useAppContext();
	const { userAddress } = use(params);

	const [user, setUser] = useState<IUser | null>(null);


	async function fetchNFTData() {
		try {
			const response = await fetch(
				`/api/getNftsByUser?address=${userAddress}`
			);
			const data: IToken[] = await response.json();

			if (response.ok) {
				setNfts(data?.filter((nft) => nft.metadata.image));
			}
		} catch (err) {
			console.log("Failed to fetch NFTs. Please try again.");
			console.error(err);
		}
	}

	async function registerUser() {
		try {
			if (!name) return;

			setSavingUser(true);
			const response = await axios.post("/api/registerUser", {
				name: name,
				address: address,
			});
			setUser(response.data);
		} catch (err) {
			console.log("Failed to register user. Please try again.");
			console.error(err);
		} finally {
			setSavingUser(false);
		}
	}

	useEffect(() => {
		if (userAddress) {
			fetchNFTData();
		}
	}, [address, contract, userAddress, refreshMap['user_nft']]);

	const searchParams = useSearchParams();
	const router = useRouter();


	useEffect(() => {
		if (!address) return;


		if (cmpAddr(userAddress, address)) {
			// this is logged in user's profile
			if (!userLoading) {
				if (currentUser == null && cmpAddr(userAddress, address)) {
					setShowRegisterModal(true)
				} // if user is null --> ask to register in app
				else setUser(currentUser) // if user is not null --> set user
			}
		}
		else {
			// this is not logged in user's profile
			axios.get('/api/getUser', { params: { address: userAddress } }).then(res => setUser(res.data))
		}

		if (searchParams.get('profile') === '1' && !cmpAddr(userAddress, address)) {
			router.push(`/profile/${address}/?profile=1`)
		}

	}, [address, currentUser])



	const tabs = ["Nfts", "Listings", "Created", "Watchlist", "Activity"];
	const [activeTab, setActiveTab] = useState(0);

	const [state, setState] = React.useState<{
		open: boolean;
		Transition: any
	}>({
		open: false,
		Transition: Fade,
	});

	const showSnackBar = (Transition: any) =>
		setState({
			open: true,
			Transition,
		});

	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			showSnackBar(Slide)
		} catch (err) {
			console.error('Failed to copy!', err);
		}
	};
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
					{!userLoading ? <Avatar
						src={user?.profilePhoto || default_user.src}
						alt="Arnab Chatterjee"
						sx={{ bgcolor: "#DE0374", width: 75, height: 75 }}
					/> : <Skeleton variant="circular" width={75} height={75} />}
					<Box display={"flex"} sx={{}} gap={2} alignItems={"center"}>

						<Stack>

							{user && <Typography fontSize={"1.4rem"}>{user.name}</Typography>}
							<Typography fontSize={user ? "0.9rem" : "1.2rem"} color={user ? "text.secondary" : ""}>
								{userAddress}
							</Typography>

						</Stack>
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
						<>

							<IconButton onClick={() => handleCopy(userAddress)}>
								<Copy
									size={20}
									weight="light"
									style={{ cursor: "pointer" }}
								/>
							</IconButton>
							<Snackbar
								open={state.open}
								onClose={() => setState({
									...state,
									open: false,
								})}
								slots={{ transition: state.Transition }}
								message='Address Copied to clipboard'
								key={state.Transition.name}
								autoHideDuration={1200}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
							/>
						</>
					</Box>
					<Typography
						variant="caption"
						width={"50vw"}
						color="text.secondary"
					>
						{user?.bio || `I'm just getting started on my NFT journey. This is
						where you'll find my favorite collectibles, creations,
						and marketplace activity. Stay tuned — more to come
						soon!`}
					</Typography>
				</Stack>
			</Box>
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

				<Box mt={2}>
					{activeTab == 0 && (
						<NFT
							nfts={
								nfts?.filter(
									(nft) =>
										nft.owner.toLowerCase() == userAddress || (nft.seller && nft.seller.toLowerCase() == userAddress)
								) ?? []
							}
						/>
					)}
					{activeTab == 2 && (
						<Created
							nfts={
								nfts?.filter(
									(nft) =>
										nft.creator.toLowerCase() == userAddress
								) ?? []
							}
						/>
					)}
				</Box>
			</Box>



			<Dialog open={showRegisterModal} onClose={() => setShowRegisterModal(false)} maxWidth="sm" fullWidth>
				<Stack gap={1} p={6} bgcolor={"#202020"}>

					<Box display={'flex'} gap={2} alignItems={'center'}>
						<PhosphorLogo color="#fff" size={50} style={{ background: '#0086FF' }} />
						<Stack gap={0.2}>
							<Typography fontSize={"1.5rem"}>Sign Up to MetaMint</Typography>
							<Typography color={"#9d9d9d"}>
								Please enter your name to continue
							</Typography>
						</Stack>
					</Box>
					<TextField
						autoFocus
						id="name"
						label="Username"
						value={name}
						fullWidth
						variant="filled"
						size="medium"
						sx={{ my: 2, mt: 4 }}
						onChange={(e) => setName(e.target.value)}
					/>

					<ButtonGroup fullWidth>
						<Button onClick={() => setShowRegisterModal(false)}>Later</Button>
						<Button variant="contained" onClick={registerUser}>{savingUser ? <CircularProgress size={20} /> : "Sign Up"}</Button>
					</ButtonGroup>

				</Stack>
			</Dialog>
		</Stack>
	);
}

export default Page;
