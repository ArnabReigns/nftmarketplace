import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useContract(
  contractAddress: string | undefined,
  contractABI: any,
  userAddress: string | null
) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const loadContract = async () => {
      if (!window.ethereum || !userAddress || !contractAddress || !contractABI) {
        setContract(null);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const instance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(instance);
    };

    loadContract();
  }, [userAddress, contractAddress, contractABI]);

  return {contract};
}
