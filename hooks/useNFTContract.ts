import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "@/lib/nftContractABi.json";

export function useContract(userAddress: string | null) {
	const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
	const [contract, setContract] = useState<ethers.Contract | null>(null);

	useEffect(() => {
		const loadContract = async () => {
			if (
				!window.ethereum ||
				!userAddress ||
				!NFT_CONTRACT_ADDRESS ||
				!ABI
			) {
				setContract(null);
				return;
			}

			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			const instance = new ethers.Contract(
				NFT_CONTRACT_ADDRESS,
				ABI,
				signer
			);
			setContract(instance);
		};

		loadContract();
	}, [userAddress]);

	return { contract };
}
