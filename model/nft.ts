import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
	tokenId: {
		type: String,
		required: true,
		unique: true, // Ensure each tokenId is unique in the database
	},
	nftContract: {
		type: String,
		required: true, // NFT contract address
	},
	owner: {
		type: String,
		required: true, // Current owner address
	},
	creator: {
		type: String,
		required: true,
	},
	listingId: {
		type: Number,
		default: null, // The listing ID when the token is listed
	},
	price: {
		type: String, // Store price as a string to avoid precision issues
		default: null, // Price will be set when listed
	},
	seller: {
		type: String,
		default: null, // The seller's address when listed
	},
	mintedAt: {
		type: Date,
	},
	metadataUri: String,
	metadata: {
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		attributes: [
			{
				trait_type: {
					type: String,
				},
				value: {
					type: String,
				},
			},
		],
		external_url: String,
	},
	history: [
		{
			from: {
				type: String,
				required: true, // Sender address during the transfer
			},
			to: {
				type: String,
				required: true, // Receiver address during the transfer
			},
			date: {
				type: Date,
				default: Date.now, // The timestamp when the transfer happened
			},
		},
	],
});

TokenSchema.index({ tokenId: 1, nftContract: 1 }, { unique: true }); // Ensure unique combination of tokenId and nftContract

export const Token: mongoose.Model<IToken> = mongoose.models.Token || mongoose.model<IToken>("Token", TokenSchema);

export interface IToken {
	tokenId: string;
	nftContract: string;
	owner: string;
	creator: string;
	listingId?: number | null;
	price?: string | null;
	seller?: string | null;
	mintedAt?: Date;
	metadataUri?: string;
	metadata: {
		name: string;
		description: string;
		image: string;
		attributes: Array<{
			trait_type?: string;
			value?: string;
		}>;
		external_url?: string;
	};
	history: Array<{
		from: string;
		to: string;
		date?: Date;
	}>;
}
