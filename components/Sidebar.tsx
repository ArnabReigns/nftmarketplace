'use client'

import { Box, BoxProps, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CellSignalHigh, Compass, Icon, ListDashes, Pencil, User } from "@phosphor-icons/react";
import { PhosphorLogo } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';

const Sidebar = () => {
    const [selected, setSelected] = useState(-1);
    const [pointerOver, setPointerOVer] = useState(false);
    const { address } = useWallet()

    // Pass the icon components themselves in the menu items
    const menuItems = [
        { title: 'Discover', icon: Compass, path: '/' },
        { title: 'Stats', icon: CellSignalHigh, path: '/stats' },
        { title: 'Activity', icon: ListDashes, path: '/activity' },
        { title: 'Studio', icon: Pencil, path: '/studio' },
        { title: 'Profile', icon: User, path: '/profile' }
    ];

    const pathname = usePathname()
    useEffect(() => {

        console.log(pathname)

        menuItems.forEach((item, idx) => {
            if (pathname.startsWith(item.path)) setSelected(idx)
        })

    }, [pathname])


    return (
        <Box sx={{
            position: 'fixed',
            bgcolor: '#141415',
            top: 0,
            left: 0,
            width: '3.7rem',
            color: 'white',
            p: 1,
            overflow: 'hidden',
            minHeight: '100vh',
            borderColor: '#26272D',
            borderRightWidth: '2px',
            transition: 'all 0.1s ease-out',
            zIndex: 999,
            ":hover": {
                width: '12rem'
            }
        }}
            onPointerOver={() => {
                setPointerOVer(true)
            }}

            onPointerLeave={() => setPointerOVer(false)}
        >
            <Box sx={{
                p: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
            }}>
                <Box>
                    <PhosphorLogo size={28} weight='fill' color='#0086FF' />
                </Box>
                {pointerOver && <Typography sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700
                }}>MetaMint</Typography>}
            </Box>

            <Stack gap={1}>
                {menuItems.map((item, idx) => (
                    <MenuItems
                        pointer={pointerOver}
                        icon={item.icon}
                        path={item.path}
                        key={idx}
                        active={selected === idx}
                        item={item.title}
                    // onClick={() => setSelected(idx)}
                    />
                ))}
            </Stack>
        </Box>
    )
}

interface MenuItems extends BoxProps {
    active: boolean,
    item: string,
    icon: Icon,
    pointer: boolean,
    path?: string
}

const MenuItems = ({ active, item, icon: Icon, pointer, path = '', ...boxProps }: MenuItems) => {
    return (
        <Link href={path}>
            <Box
                {...boxProps}
                sx={[
                    {
                        width: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        ":hover": {
                            bgcolor: '#26272D'
                        }

                    },
                    active && { bgcolor: '#26272D' },


                ]}>
                <Box px={1}>
                    <Icon weight={active ? 'duotone' : 'bold'} size={25} color={active ? 'white' : 'gray'} />
                </Box>
                {pointer && <Typography sx={{ color: 'white' }}>
                    {item}
                </Typography>}
            </Box>
        </Link>
    )
}

export default Sidebar
