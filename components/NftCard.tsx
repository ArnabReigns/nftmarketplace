'use client';

import NftButton from '@/app/profile/[userAddress]/(components)/NftButton'
import { useMArketContract } from '@/hooks/useMarketContract';
import { useContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet'
import { shortenAddress } from '@/lib/shortenAddress'
import { IToken } from '@/model/nft'
import { Box, Button, Dialog, Divider, Fade, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { ethers } from 'ethers';
import Image from 'next/image'
import React, { useState } from 'react'

const NftCard = ({ nft }: { nft: IToken }) => {

  const [active, setActive] = useState<IToken | null>(null);
  const [val, setVal] = useState<string | null>("0");
  const { address } = useWallet();
  const { contract } = useMArketContract(address);
  const { contract: nftContract } = useContract(address);


  async function handleListItem() {
    try {
      const fee = ethers.parseUnits("10", "wei");

      let tx = await nftContract?.approve(
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS,
        active?.tokenId
      );
      await tx.wait();
      tx = await contract?.listItem(
        active?.nftContract,
        active?.tokenId,
        ethers.parseUnits(val!.toString(), "ether"),
        {
          value: fee,
        }
      );
      await tx.wait();
      console.log("item listed");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#141415",
          borderColor: "#262627",
          borderWidth: 2,
          transition: "transform 0.2s ease-out",
          boxShadow: "0 2px 10px -2px #9f9f9f14",
          ":hover": {
            transform: "translateY(-2px)",
            "& .list-btn": {
              bottom: 0,
            },
          },
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "15rem",
            width: "14rem",
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
            ":hover img": {
              scale: 1.1,
            },
          }}
        >
          <Image
            style={{ transition: "all 0.3s ease" }}
            src={nft.metadata.image}
            alt={nft.metadata.description}
            fill={true}
            objectFit="cover"
          />
        </Box>
        <Box p={1}>
          <Typography>{nft.metadata.name}</Typography>
          <Box display={"flex"} gap={1} mt={2}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                "https://sepolia.etherscan.io/address/" +
                nft.nftContract
              }
            >
              <Typography
                sx={{
                  bgcolor: "#262525",
                  border: "1px solid #414040",
                  p: 0.2,
                  px: 1,
                  borderRadius: 2,
                  fontSize: "0.9rem",
                }}
              >
                {shortenAddress(nft.nftContract)}
              </Typography>
            </a>
            <Typography
              sx={{
                bgcolor: "#262525",
                border: "1px solid #414040",
                p: 0.2,
                px: 1,
                borderRadius: 2,
                fontSize: "0.9rem",
              }}
            >
              TOKEN #{nft.tokenId}
            </Typography>
          </Box>
        </Box>

        {nft.owner.toLowerCase() == address ? (
          <NftButton onClick={() => setActive(nft)} >List for sale</NftButton>
        ) : (
          <NftButton onClick={() => { }} >Make a offer</NftButton>
        )}

      </Box>

      {active && (
        <Dialog
          open={active != null}
          onClose={() => setActive(null)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                background: "none",
                borderRadius: 5,
              },
            },
          }}
        >
          <Fade in={true} appear>
            <Stack
              gap={2}
              bgcolor={"#252525"}
              // borderRadius={5}
              p={4}
            >
              <Typography
                fontSize={"1.5rem"}
                fontWeight={600}
                mb={3}
              >
                Quick List
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Image
                  src={active?.metadata.image ?? null}
                  alt="nft-img"
                  objectFit="cover"
                  width={300}
                  height={300}
                  style={{
                    height: "7rem",
                    width: "7rem",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <Stack gap={0.5}>
                  <Typography
                    fontSize={"1.2rem"}
                    fontWeight={500}
                  >
                    {active?.metadata.name} #
                    {active?.tokenId}
                  </Typography>
                  <Typography color="#aaa">
                    MNFT
                  </Typography>
                </Stack>

                <Box ml={"auto"}>
                  <Stack alignItems={"flex-end"}>
                    <Typography
                      fontSize={"0.95rem"}
                      color="#aaa"
                      fontWeight={500}
                    >
                      Listing price
                    </Typography>
                    <Typography
                      fontSize={"1.3rem"}
                      color="#fff"
                      fontWeight={500}
                    >
                      {val && parseFloat(val) > 0
                        ? val
                        : "--"}{" "}
                      ETH
                    </Typography>
                    {val && parseFloat(val) > 0 && (
                      <Typography
                        fontSize={"0.95rem"}
                        color="#aaa"
                        fontWeight={500}
                      >
                        {(
                          parseFloat(val) * 1200
                        ).toFixed(2)}{" "}
                        INR
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>

              <Divider />

              <Tooltip
                placement={"top-start"}
                sx={{ fontSize: "1rem" }}
                title={
                  <Typography>
                    You will not be able to change the price
                    after listing. If you'd like to change
                    the price, you will need to create a new
                    listing.
                  </Typography>
                }
              >
                <Typography width={"fit-content"}>
                  Set a price
                </Typography>
              </Tooltip>
              <TextField
                value={val}
                type="number"
                onChange={(e) => setVal(e.target.value)}
                placeholder="Amount"
                slotProps={{
                  input: {
                    endAdornment: (
                      <Box
                        sx={{
                          px: 3,
                          pl: 3,
                          borderLeft:
                            "1px solid gray",
                        }}
                      >
                        ETH
                      </Box>
                    ),
                  },
                }}
              />

              <Stack gap={1} mt={3}>
                <Stack
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    fontSize={"1.1rem"}
                    fontWeight={500}
                  >
                    Listing Price
                  </Typography>
                  <Typography>
                    {val && parseFloat(val) > 0
                      ? val
                      : "--"}{" "}
                    ETH
                  </Typography>
                </Stack>
                <Stack
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    fontSize={"1.1rem"}
                    fontWeight={500}
                  >
                    MetaMint Fee
                  </Typography>
                  <Typography color="#34C77B">
                    0.5%
                  </Typography>
                </Stack>
                <Stack
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    fontSize={"1.1rem"}
                    fontWeight={500}
                  >
                    Total potential earnings
                  </Typography>
                  <Typography>
                    {val
                      ? (
                        parseFloat(val) -
                        (parseFloat(val) * 0.5) /
                        100
                      ).toFixed(val.length)
                      : "--"}{" "}
                    ETH
                  </Typography>
                </Stack>
              </Stack>

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleListItem}
              >
                Complete Listing
              </Button>
            </Stack>
          </Fade>
        </Dialog>
      )}
    </>
  )
}

export default NftCard
