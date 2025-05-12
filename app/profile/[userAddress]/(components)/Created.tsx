import { useMArketContract } from "@/hooks/useMarketContract";
import { useContract } from "@/hooks/useNFTContract";
import { useWallet } from "@/hooks/useWallet";
import { IToken } from "@/model/nft";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Button,
	Collapse,
	Dialog,
	Divider,
	Fade,
	Grow,
	Slide,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import FilterTags from "@/components/FilterTags";
import {
	CaretDown,
	ArrowFatLinesDown,
	Copy,
	Globe,
	Pencil,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { shortenAddress } from "@/lib/shortenAddress";
import Link from "next/link";
import NftButton from "./NftButton";
import NftCard from "@/components/NftCard";

export const Created = ({
	nfts,
	symbol,
}: {
	nfts: IToken[] | null;
	symbol?: string;
}) => {
	const [active, setActive] = useState<IToken | null>(null);

	const [val, setVal] = useState<string | null>("0");

	const { address } = useWallet();
	const { contract } = useMArketContract(address);
	const { contract: nftContract } = useContract(address);

	useEffect(() => {
		if (contract) {
			console.log("contract loaded");
		}
	}, [contract]);

	async function handleListItem() {
		try {
			const fee = ethers.parseUnits("10", "wei");

			let tx = await nftContract?.approve(
				process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS,
				active?.tokenId
			);
			tx.wait();
			tx = await contract?.listItem(
				active?.nftContract,
				active?.tokenId,
				ethers.parseUnits(val!.toString(), "ether"),
				{
					value: fee,
				}
			);
			tx.wait();
			console.log("item listed");
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
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
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Suspendisse malesuada lacus ex, sit amet
							blandit leo lobortis eget.
						</AccordionDetails>
					</Accordion>
				</Box>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
					{nfts?.map((nft, idx) => (
						<NftCard nft={nft} key={idx} />
					))}
				</Box>
			</Box >
		</>
	);
};
