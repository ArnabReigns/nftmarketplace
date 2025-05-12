'use client';

import { FileUpload } from '@/components/FileUploader';
import { useContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet';
import { Box, Button, CircularProgress, Dialog, Stack, Step, StepContent, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import { ethers } from 'ethers';
import React, { useState } from 'react';

// Add a utility function to upload to your backend API
const uploadToBackend = async (file: File, name: string, description: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);

    const response = await fetch('/api/pinata', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload to backend');
    }

    return await response.json(); // Expecting the final metadata URI (IPFS URI or Pinata gateway URL)
};

const steps = [
    {
        label: 'Uploading to decentralized server',
        caption: 'This may take a few moments.',
    },
    {
        label: 'Go to your wallet to approve this transaction',
        caption: 'A blockchain transaction is required to mint your NFT.',
    },
    {
        label: 'Minting your item',
        caption: 'Please stay on this page and keep this browser tab open.',
    },
];

function Page() {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mintingStatus, setMintingStatus] = useState<string>('');
    const [mintSate, setMintstate] = useState(0);


    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    const { address } = useWallet();
    const { contract } = useContract(address)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    const handleMint = async () => {
        if (!file || !name || !description) {
            alert("Please provide all fields.");
            return;
        }

        setIsLoading(true);
        setMintingStatus("Uploading to IPFS...");

        try {
            const result = await uploadToBackend(file, name, description);
            setMintstate(1);
            const metadataUri = result.metadataUri; // The final metadata URI from your backend

            setMintingStatus("Minting NFT...");

            // Step 2: Mint NFT
            if (metadataUri && contract) {
                setMintingStatus("Minting NFT...");
                const mintFee = ethers.parseUnits("1", "wei"); // 1 wei

                // Call the mint function with tokenURI and the mint fee
                const tx = await contract.mint(metadataUri, { value: mintFee });
                setMintstate(2)
                await tx.wait()
                setMintstate(3)
                const txHash = tx.hash; // Get the transaction hash
                setMintingStatus("NFT Minted successfully!");
            } else {
                setMintingStatus("Error: No metadata URI found.");
            }


            setMintingStatus("NFT Minted successfully!");
        } catch (error) {
            console.error("Error during minting:", error);
            setMintingStatus("Minting failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 10, px: 15 }}>
            <Box mb={4}>
                <Typography fontSize={'2.5rem'}>Create an NFT</Typography>
                <Typography fontSize={'1.2rem'}>Once your item is minted, you will not be able to change any of its information.</Typography>
            </Box>

            <Stack flexDirection={'row'} gap={10}>
                <Box flex={1}>
                    <FileUpload onChange={handleFileChange} />
                </Box>

                <Stack flex={1} gap={3}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        onClick={handleMint}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Mint'}
                    </Button>

                </Stack>
            </Stack>

            <Dialog open={isLoading} maxWidth='sm' fullWidth sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 4,
                },
            }}>

                <Box sx={{
                    p: 4,
                    bgcolor: '#202020',

                }}>
                    <Typography fontSize={'1.6rem'} fontWeight={'500'}>Crafting your item</Typography>


                    <Stepper activeStep={mintSate} orientation="vertical" sx={{ mt: 4 }}>
                        {steps.map((step, index) => (
                            <Step key={index} completed={mintSate > index}>
                                <StepLabel>
                                    <Typography fontSize="1.2rem">{step.label}</Typography>
                                </StepLabel>
                                <StepContent sx={{ lineHeight: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {step.caption}
                                    </Typography>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Dialog>
        </Box>
    );
};


export default Page;
