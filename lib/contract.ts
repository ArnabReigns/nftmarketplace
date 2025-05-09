import { ethers } from "ethers";
import CONTRACT_ABI from "./nftContractABi.json";

const INFURA_PROJECT_ID = "1a9554bdb0cc422db36a29b3af334a0e";
const CONTRACT_ADDRESS = "0x0D594b6A76b953C0852f3B2dC76d535a0Fdd87F6";

export function getContract() {
	const provider = new ethers.JsonRpcProvider(
		`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`
	);

	const contract = new ethers.Contract(
		CONTRACT_ADDRESS,
		CONTRACT_ABI,
		provider
	);

	return contract;
}
