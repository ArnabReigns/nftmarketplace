import FilterTags from "@/components/FilterTags";
import NftCard from "@/components/NftCard";
import { IToken } from "@/model/nft";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary, Box, Typography
} from "@mui/material";
import {
	CaretDown
} from "@phosphor-icons/react/dist/ssr";

export const Created = ({
	nfts,
	symbol,
}: {
	nfts: IToken[] | null;
	symbol?: string;
}) => {

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
