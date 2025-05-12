import { Button, ButtonGroup, ButtonProps, Divider, ListItemText, Menu, MenuItem, MenuList, Paper, Typography } from '@mui/material'
import { DotsThreeOutlineVertical } from '@phosphor-icons/react/dist/ssr'
import React, { useState } from 'react'

interface NftButtonProps extends ButtonProps {

}
const NftButton = ({ children, ...buttonProps }: NftButtonProps) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
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
                    // size="small"
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

                        <MenuItem>
                            {/* <ListItemIcon> */}
                            {/* icon */}
                            {/* </ListItemIcon> */}


                            <ListItemText>
                                Cut
                            </ListItemText>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                ⌘X
                            </Typography>
                        </MenuItem>
                        <MenuItem>
                            {/* <ListItemIcon>
														<ContentCopy fontSize="small" />
													</ListItemIcon> */}
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
                        </MenuItem>
                        <MenuItem>
                            {/* <ListItemIcon>
														<ContentPaste fontSize="small" />
													</ListItemIcon> */}
                            <ListItemText>
                                Paste
                            </ListItemText>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                ⌘V
                            </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                            {/* <ListItemIcon>
														<Cloud fontSize="small" /> 
													</ListItemIcon> */}
                            <ListItemText>
                                Web Clipboard
                            </ListItemText>
                        </MenuItem>
                    </MenuList>
                </Paper>
            </Menu>
        </>
    )
}

export default NftButton
