import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useEffect, useState } from "react";

export function useWallet() {
	const [address, setAddress] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [provider, setProvider] = useState<BrowserProvider | null>(null);
	const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

	useEffect(() => {
		if (!window.ethereum) {
			console.error("MetaMask is not installed");
			return;
		}

		const accounts = async () =>
			await window.ethereum.request({
				method: "eth_accounts",
			});

		accounts().then((res) => {

		});

		const handleAccountsChanged = async (accounts: string[]) => {
			if (accounts.length === 0) {
				disconnectWallet();
			} else {
				const newProvider = new BrowserProvider(window.ethereum);
				const newSigner = await newProvider.getSigner();

				setProvider(newProvider);
				setSigner(newSigner);
				setAddress(accounts[0]);
				setIsConnected(true);
			}
		};

		const handleChainChanged = (_chainId: string) => {
			// Reload page to avoid stale state
			window.location.reload();
		};

		window.ethereum.on("accountsChanged", handleAccountsChanged);
		window.ethereum.on("chainChanged", handleChainChanged);

		// Check initial connection on mount
		const checkWalletConnection = async () => {
			try {
				const accounts = await window.ethereum.request({
					method: "eth_accounts",
				});
				if (accounts.length > 0) {
					const newProvider = new BrowserProvider(window.ethereum);
					const newSigner = await newProvider.getSigner();

					setProvider(newProvider);
					setSigner(newSigner);
					setAddress(accounts[0]);
					setIsConnected(true);
				}
			} catch (error) {
				console.error("Error checking wallet connection:", error);
			}
		};

		checkWalletConnection();

		return () => {
			// Clean up listeners on unmount
			window.ethereum.removeListener(
				"accountsChanged",
				handleAccountsChanged
			);
			window.ethereum.removeListener("chainChanged", handleChainChanged);
		};
	}, []);

	const connectWallet = async () => {
		if (!window.ethereum) {
			alert("MetaMask is not installed");
			return;
		}

		try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			const newProvider = new BrowserProvider(window.ethereum);
			const newSigner = await newProvider.getSigner();

			setProvider(newProvider);
			setSigner(newSigner);
			setAddress(accounts[0]);
			setIsConnected(true);
		} catch (error) {
			console.error("Error connecting wallet:", error);
		}
	};

	const disconnectWallet = () => {
		setAddress(null);
		setIsConnected(false);
		setProvider(null);
		setSigner(null);
	};

	return {
		address,
		isConnected,
		provider,
		signer,
		connect: connectWallet,
		disconnect: disconnectWallet,
	};
}
