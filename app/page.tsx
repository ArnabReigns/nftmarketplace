'use client';

import FilterTags from '@/components/FilterTags'
import { Box, Stack, Typography } from '@mui/material'
import { Article, Camera, GameController, Pen, UserCircle } from '@phosphor-icons/react/dist/ssr'
const { ethers } = require("ethers");
import React, { useEffect, useState } from 'react'
import CONTRACT_ABI from '@/lib/nftContractABi.json'
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';


const page = () => {

  const { address } = useWallet();
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, CONTRACT_ABI, address)


  const filterTags = [
    { name: 'All' },
    { name: 'Gaming', icon: GameController },
    { name: 'Art', icon: Pen },
    { name: 'PFPs', icon: UserCircle },
    { name: 'Photography', icon: Camera }]

  const [nfts, setNfts] = useState();

  useEffect(() => {

    async function getTokenCount() {
      const count = await contract!.tokenCount();
      setNfts(count);
    }

    if (contract) {
      getTokenCount()
    }

  }, [address, contract])

  return (
    <Box color={'white'} height={'100vh'} p={1}>
      <Stack flexDirection={'row'} gap={1} flexWrap={'wrap'}>
        {filterTags.map((filter, idx) => (
          <FilterTags key={idx} tag={filter.name} icon={filter.icon} />
        ))}
      </Stack>
      {nfts && <Typography mt={2}>
        total nfts : {nfts}
      </Typography>}
    </Box>
  )
}

export default page