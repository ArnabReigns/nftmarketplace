'use client';

import NftButton from '@/app/profile/[userAddress]/(components)/NftButton'
import { useAppContext } from '@/context/AppContext';
import { useMArketContract } from '@/hooks/useMarketContract';
import { useContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet'
import { shortenAddress } from '@/lib/shortenAddress'
import { IToken } from '@/model/nft'
import { Box, Button, CircularProgress, Dialog, Divider, Fade, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { ethers } from 'ethers';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const NftCard = ({ nft }: { nft: IToken }) => {

  const [active, setActive] = useState<{ state: string; nft: IToken } | null>(null);
  const [val, setVal] = useState<string | null>(ethers.formatEther(nft.price?.toString() ?? '0'));
  const { address } = useWallet();
  const { contract } = useMArketContract(address);
  const { contract: nftContract } = useContract(address);

  const { triggerRefresh } = useAppContext()

  const [loading, setLoading] = useState<null | {
    state: string;
    message: string;
  }>()


  const loadingStates = {
    listing: 'listing',
    updating: 'updating',
    canceling: 'cancel',
    buying: 'buying'
  }


  async function handleBuyItem() {
    if (active?.state != 'buying' || !active.nft || !active.nft.listingId) return;
    try {
      setLoading({
        state: loadingStates.buying,
        message: "Waiting for approval..."
      })
      let tx = await contract?.buyItem(
        active?.nft?.listingId,
        {
          value: active?.nft?.price
        }
      );
      setLoading({
        state: loadingStates.buying,
        message: "Waiting for transaction to complete..."
      })
      await tx.wait();
      toast.success('Item bought successfully');
      triggerRefresh('user_nft')
    } catch (err) {
      console.log(err);
      toast.error('Failed to buy item. Please try again.');
    } finally {
      setLoading(null);
      setActive(null);
    }
  }


  async function handleListItem() {
    if (active?.state != 'listing' || !active.nft || !val) return;

    if (parseFloat(val) <= 0) {
      return toast.error('Price must be greater than 0');
    }
    try {
      const fee = ethers.parseUnits("10", "wei");

      setLoading({
        state: loadingStates.listing,
        message: "Waiting for withdrawal permissions..."
      })
      let tx = await nftContract?.approve(
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS,
        active?.nft?.tokenId
      );
      setLoading({
        state: loadingStates.listing,
        message: "Waiting for transaction to complete..."
      })
      await tx.wait();
      setLoading({
        state: loadingStates.listing,
        message: "Waiting for approving listing..."
      })
      tx = await contract?.listItem(
        active?.nft?.nftContract,
        active?.nft?.tokenId,
        ethers.parseUnits(val!.toString(), "ether"),
        {
          value: fee,
        }
      );
      setLoading({
        state: loadingStates.listing,
        message: "Finalizing listing..."
      })
      await tx.wait();
      console.log("item listed");
      toast.success('Item listed successfully');
      triggerRefresh('user_nft')
    } catch (err) {
      console.log(err);
      toast.error('Failed to list item');
    } finally {
      setLoading(null);
      setActive(null);
    }
  }


  async function handleCancelListing() {
    if (active?.state != 'updating' || !active.nft || !active.nft.listingId) return;
    try {
      setLoading({
        state: loadingStates.canceling,
        message: "waiting for approval..."
      })
      let tx = await contract?.cancelListing(
        active?.nft?.listingId,
      );
      setLoading({
        state: loadingStates.canceling,
        message: "canceling listing..."
      })
      await tx.wait();
      toast.success('Listing cancelled successfully');
      triggerRefresh('user_nft')
    } catch (err) {
      console.log(err);
      toast.error('Failed to cancel listing');
    } finally {
      setLoading(null);
      setActive(null);
    }
  }

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          width: 'fit-content',
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
              position: "absolute",
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
          <Typography fontSize={'1.2rem'} fontWeight={600}>{nft.metadata.name}</Typography>
          {nft.price && <Typography color='#ccc'>{ethers.formatEther(nft.price)} ETH</Typography>}
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


        {nft.listingId != null && nft.seller?.toLowerCase() == address && (
          <NftButton
            nft={nft}
            onClick={() => setActive({
              state: 'updating',
              nft
            })} >Update listing</NftButton>
        )}

        {nft.seller?.toLowerCase() != address && nft.listingId != null && (
          <NftButton
            onClick={() => setActive({
              state: 'buying',
              nft
            })} >Buy Nft</NftButton>
        )}

        {nft.owner.toLowerCase() == address && nft.listingId == null && (
          <NftButton
            nft={nft}
            onClick={() => setActive({
              state: 'listing',
              nft
            })} >List for sale</NftButton>
        )}

      </Box>

      {active && (
        <Dialog
          disableRestoreFocus
          open={active != null}
          onClose={() => { setActive(null) }}
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
                  src={active?.nft?.metadata.image ?? null}
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
                    {active?.nft?.metadata.name} #
                    {active?.nft?.tokenId}
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

              {active.state == 'listing' &&
                <>
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
                </>
              }

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
                {active.state == 'listing' &&
                  <>
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
                  </>}
              </Stack>

              {active.state == 'listing' && <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleListItem}
                disabled={Boolean(loading)}
              >
                {
                  loading?.state == loadingStates.listing ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                    <Typography>{loading.message}</Typography>
                  </Box> : 'list'
                }
              </Button>}

              {active.state == 'updating' && (
                <Button
                  variant="contained"
                  color='error'
                  disabled={Boolean(loading)}
                  sx={{ mt: 1 }}
                  onClick={handleCancelListing}
                >
                  {loading?.state == loadingStates.canceling ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                    <Typography>{loading.message}</Typography>
                  </Box> : 'cancel listing'}
                </Button>
              )}


              {active.state == 'buying' && (
                <Button
                  variant="contained"
                  disabled={Boolean(loading)}
                  sx={{ mt: 1 }}
                  onClick={handleBuyItem}
                >
                  {loading?.state == loadingStates.buying ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                    <Typography>{loading.message}</Typography>
                  </Box> : 'Buy Item'}
                </Button>
              )}
            </Stack>
          </Fade>
        </Dialog>
      )}
    </>
  )
}

export default NftCard
