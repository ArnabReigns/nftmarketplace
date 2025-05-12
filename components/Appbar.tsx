'use client'

import { Box, Divider, Skeleton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Button from './Button'
import { MagnifyingGlass, Wallet } from '@phosphor-icons/react/dist/ssr'
import { useWallet } from '@/hooks/useWallet'
import { formatEther } from 'ethers';
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link'

export const APPBAR_HEIGHT = '3.5rem';

const Appbar = () => {


    const { user } = useAppContext()

    const { address, connect, provider } = useWallet();
    const [balance, setBalance] = useState<bigint | null>(null);


    useEffect(() => {

        async function getBalance() {
            if (!address) return;
            const bal = await provider?.getBalance(address);
            if (bal) setBalance(bal);
        }

        getBalance();

    }, [address])
    return (
        <Box sx={{
            position: 'fixed',
            height: '3.5rem',
            p: 1,
            paddingLeft: '4.7rem',
            width: '100%',
            background: 'rgba(0, 0, 0, 0.078)',
            backdropFilter: 'blur(18px)',
            display: 'flex',
            borderColor: '#38343C',
            borderBottomWidth: '2px',
            alignItems: 'center',
            zIndex: 3,
        }}>
            <Box color={'white'} sx={{
                background: 'rgba(48, 48, 48, 0.214)',
                backdropFilter: 'blur(30px)',
                p: 0.7,
                px: 1.5,
                width: '16rem',
                borderRadius: 2,
                border: '2px solid #38343C',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <MagnifyingGlass />
                <Typography fontSize={'0.9rem'}>Search MetaMint</Typography>
            </Box>
            {user ? (<Box marginLeft={'auto'} display={'flex'} gap={1}>
                {balance && <Button>
                    {parseFloat(formatEther(balance)).toFixed(4) + ' ETH'}
                </Button>}
                <Divider orientation="vertical" flexItem />
                <Link href={'/profile/' + address + '?profile=1'}>
                    <Button >
                        {user.name}
                    </Button>
                </Link>

            </Box>) : (<Box marginLeft={'auto'}>
                <Button
                    icon={Wallet}
                    iconProps={{
                        weight: 'duotone',
                    }}
                    onClick={connect}
                >{address && balance ? address + ' | ' + parseFloat(formatEther(balance)).toFixed(4) + ' ETH' : 'Connect Wallet'}</Button>
            </Box>)}

        </Box >
    )
}

export default Appbar