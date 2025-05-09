import { BrowserProvider, Signer } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletConnection {
  provider: BrowserProvider;
  signer: Signer;
  address: string;
}

export const connectWallet = async (): Promise<WalletConnection> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return {
      provider,
      signer,
      address,
    };
  } catch (error: any) {
    throw new Error(`Wallet connection failed: ${error.message}`);
  }
};
