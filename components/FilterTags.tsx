import { Box } from "@mui/material";
import { Icon } from "@phosphor-icons/react";
import React from "react";

const FilterTags = ({
	tag,
	icon: Icon,
	fontSize = "1rem",
	active=false,
}: {
	tag: string;
	fontSize?: any;
	icon?: Icon;
	active?: boolean;
}) => {
	return (
		<Box
			sx={[
				{
					p: 0.5,
					px: 2,
					borderRadius: 2,
					width: "fit-content",
					border: "1px solid #2B292B",
					cursor: "pointer",
					bgcolor: "#191718",
					display: "flex",
					gap: 1,
					fontSize: fontSize,
					alignItems: "center",
					":hover": {
						bgcolor: "#262525",
						border: "1px solid #414040",
					},
				},
				active && {
					bgcolor: "#262525",
					border: "1px solid #414040",
				},
			]}
		>
			{Icon && <Icon />}
			{tag}
		</Box>
	);
};

export default FilterTags;
