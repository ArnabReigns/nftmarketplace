import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import StdioImg from '@/public/studio2.jpg'
import { APPBAR_HEIGHT } from '@/components/Appbar'
import { CodesandboxLogo, Palette, PhosphorLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const page = () => {
  return (
    <Box sx={{
      display: 'flex',
      overflow: 'hidden',
      alignItems: 'stretch',
    }}>

      <Stack flex={1} justifyContent={"center"} gap={1}>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <PhosphorLogo color='#0086FF' size={50} />
          <Typography sx={{
            color: 'white',
            fontSize: '3.2rem'
          }}>Create</Typography>
        </Box>

        <Stack gap={2} p={2}>

          <Box p={3} bgcolor={'#202020'} borderRadius={2} sx={{
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            ":hover": {
              transform: 'translateY(-2px)'
            }

          }}>
            <Box display={'flex'} gap={1} alignItems={'center'}>
              <CodesandboxLogo color='white' size={30} />
              <Typography sx={{
                color: 'white',
                fontSize: '1.5rem'
              }}>Import an NFT</Typography>
            </Box>
            <Typography sx={{
              color: '#aaa',
              fontSize: '0.95rem',
              mt: 1,
            }}>
              Bring in your existing NFT from an external smart contract. Perfect for showcasing or listing your already-minted assets.
            </Typography>
          </Box>

          <Link href={'/studio/create'}>
            <Box p={3} bgcolor={'#202020'} borderRadius={2} sx={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              ":hover": {
                transform: 'translateY(-2px)'
              }

            }}>
              <Box display={'flex'} gap={1} alignItems={'center'} >
                <Palette color='white' size={30} />
                <Typography sx={{
                  color: 'white',
                  fontSize: '1.5rem'
                }}>Create a Collection or Item</Typography>
              </Box>
              <Typography sx={{
                color: '#aaa',
                fontSize: '0.95rem',
                mt: 1,
              }}>
                Design and mint a new NFT or organize your assets into a themed collection. Ideal for creators launching original content.
              </Typography>
            </Box>
          </Link>
        </Stack>
      </Stack>

      <Box flex={1} sx={{
        height: `calc(100vh - 3.5rem)`,
      }} >
        <Image src={StdioImg} style={{ objectFit: 'cover', width: '100%', height: '100%' }} alt='studio image' />
      </Box>

    </Box >
  )
}

export default page
