import { useAppContext } from '@/context/AppContext'
import { cmpAddr } from '@/lib/compareAddress'
import { IToken } from '@/model/nft'
import { Box, Button, ButtonGroup, ButtonProps, Divider, ListItemText, Menu, MenuItem, MenuList, Paper, Typography } from '@mui/material'
import { DotsThreeOutlineVertical } from '@phosphor-icons/react/dist/ssr'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface NftButtonProps extends ButtonProps {

    nft?: IToken

}
const NftButton = ({ nft, children, ...buttonProps }: NftButtonProps) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { address, user, setUser } = useAppContext();


    useEffect(() => {
        console.log(address, nft?.seller, nft?.owner);
    }, [nft, address])

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <ButtonGroup
                className={"list-btn"}
                sx={{
                    position: "absolute",
                    width: "100%",
                    bottom: open ? 0 : "-4rem",
                    transition: "all 0.3s ease-out",
                }}
            >
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: "primary.dark",
                        p: 1,
                        color: "white",
                        borderRadius: 0,
                    }}
                    {...buttonProps}
                >
                    {children}
                </Button>
                <Button
                    sx={{
                        bgcolor: "primary.dark",
                        color: "white",
                        borderRadius: 0,
                    }}
                    onClick={handleClick}
                >
                    <DotsThreeOutlineVertical
                        size={20}
                        weight="fill"
                    />
                </Button>
            </ButtonGroup>

            <Menu
                slotProps={{
                    list: {
                        sx: {
                            p: 0,
                        },
                    },
                }}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                disableEnforceFocus
                disableRestoreFocus
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Paper
                    sx={{
                        width: 200,
                        maxWidth: "100%",
                    }}
                >
                    <MenuList>


                        {/* <MenuItem>
                            <ListItemIcon>
                                <ContentCopy fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                Copy
                            </ListItemText>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                ⌘C
                            </Typography>
                        </MenuItem> */}
                        {(cmpAddr(nft?.owner, address) || cmpAddr(nft?.seller, address)) && < MenuItem onClick={() => {
                            axios.post('/api/setProfilePicture', {
                                address: address,
                                profilePhoto: nft?.metadata.image
                            }).then((res) => {
                                console.log(res.data.message);
                                setUser(res.data.user);
                                toast.success('Profile picture set successfully');
                            }).catch(() => {
                                console.log("Failed to set profile picture. Please try again.");
                                toast.error("Failed to set profile picture. Please try again.");
                            })
                            handleClose();
                        }}>
                            <ListItemText>
                                Set as profile picture
                            </ListItemText>
                        </ MenuItem>}
                        <Divider />
                        <MenuItem disabled>
                            <ListItemText >
                                Hide NFT
                            </ListItemText>
                        </MenuItem>
                    </MenuList>
                </Paper>
            </Menu>
        </Box >
    )
}

export default NftButton
