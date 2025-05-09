import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useInfura(contractAddress: string, contractABI: any, infuraProjectId: string) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const loadContract = async () => {
      if (!contractAddress || !contractABI || !infuraProjectId) {
        console.error("Contract details or Infura Project ID missing");
        return;
      }

      try {
        const provider = new ethers.JsonRpcProvider(
          `https://sepolia.infura.io/v3/${infuraProjectId}`
        );
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);

        setContract(contractInstance);
      } catch (err) {
        console.error("Error loading contract:", err);
      }
    };

    loadContract();
  }, [contractAddress, contractABI, infuraProjectId]);

  return contract;
}
