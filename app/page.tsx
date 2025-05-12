'use client';

import FilterTags from '@/components/FilterTags'
import { Box, Stack, Typography } from '@mui/material'
import { Article, Camera, GameController, Pen, UserCircle } from '@phosphor-icons/react/dist/ssr'
import React, { useEffect, useState } from 'react'
import { useContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet';
import axios from 'axios';
import { IToken } from '@/model/nft';
import { IListing } from '@/model/listings';
import { ethers } from 'ethers';


const Page = () => {

  const { address } = useWallet();
  const { contract } = useContract(address)


  const filterTags = [
    { name: 'All' },
    { name: 'Gaming', icon: GameController },
    { name: 'Art', icon: Pen },
    { name: 'PFPs', icon: UserCircle },
    { name: 'Photography', icon: Camera }]

  const [nfts, setNfts] = useState<IListing[]>();

  async function fetchNFTData() {
    try {
      const response = await fetch(
        `/api/discoverNfts`
      );
      const data: IListing[] = await response.json();

      if (response.ok) {
        console.log(data);
        setNfts(data)
      }
    } catch (err) {
      console.log("Failed to fetch NFTs. Please try again.");
      console.error(err);
    }
  }

  useEffect(() => {

    if (address) {
      fetchNFTData()
    }

  }, [address, contract])

  return (
    <Box color={'white'} height={'100vh'} p={1}>
      <Stack flexDirection={'row'} gap={1} flexWrap={'wrap'}>
        {filterTags.map((filter, idx) => (
          <FilterTags key={idx} tag={filter.name} icon={filter.icon} />
        ))}
      </Stack>
      {nfts?.map((nft, idx) => (
        <Box key={idx} my={2}>
          <Typography>{nft.tokenId}</Typography>
          <Typography>{nft.nftContract}</Typography>
          <Typography>{nft.seller}</Typography>
          <Typography>{ethers.formatEther(nft.price)}</Typography>
          <Typography>{new Date(nft.createdAt).toLocaleString()}</Typography>

        </Box>
      ))}
    </Box>
  )
}

export default Page