"use client"

import { useRouter } from 'next/navigation'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'

const page = () => {

  const router = useRouter();
  return (
    <Box p={2}>
      <Typography>Stats Page</Typography>
      <Button onClick={() => router.push('/login')}>Open Login Modal</Button>
    </Box>
  )
}

export default page