import { Box, ButtonBase, ButtonBaseProps, Stack, Typography } from '@mui/material'
import { Icon, IconProps } from '@phosphor-icons/react'
import React from 'react'


interface Button extends ButtonBaseProps {
    icon?: Icon,
    iconProps?: IconProps
}

const Button = ({ children, icon: Icon, iconProps, ...buttonProps }: Button) => {
    return (
        <ButtonBase
            {...buttonProps}
            sx={{
                p: 1,
                px: 2,
                borderRadius: 1,
                color: 'white',
                fontSize: '0.9rem',
                transition: '0.3s ease',
                fontWeight: 500,
                ":hover": {
                    bgcolor: '#29272E'
                }
            }}>
            <Stack sx={{
                flexDirection: 'row',
                gap: 1,
                alignItems: 'center'
            }}>

                {Icon && <Icon size={20} {...iconProps} />}
                {children}
            </Stack>
        </ButtonBase>
    )
}

export default Button