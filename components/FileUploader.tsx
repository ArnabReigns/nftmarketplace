'use client'

import React, { useRef, useState } from 'react'
import { Box, styled } from '@mui/material'
import Image from 'next/image'
import Button from '@/components/Button';


const VisuallyHiddenInput = styled('input')({
    display: 'none'
})

const ImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '600px',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: 5,
    '&:hover .overlay': {
        opacity: 1,
    },
}))

const Overlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'opacity 0.3s ease-in-out',
    opacity: 0,
    zIndex: 1,
})

export type FileUploadProps = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onDrop?: (event: React.DragEvent<HTMLElement>) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onChange,
    onDrop,
}) => {
    const [img, setImage] = useState<string | null>(null)
    const imgRef = useRef<HTMLInputElement>(null)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return
        if (event.target.files[0]) {
            const url = URL.createObjectURL(event.target.files[0])
            setImage(url)
            console.log(url)
        }
        onChange(event)
    }

    return (
        <>
            <VisuallyHiddenInput
                type="file"
                ref={imgRef}
                onChange={handleChange}
                multiple
            />

            {img ? (
                <ImageContainer onClick={() => imgRef.current?.click()}>
                    <Overlay className="overlay" />
                    <Image
                        alt="Uploaded preview"
                        src={img}
                        layout="fill"
                        objectFit="cover"
                    />
                </ImageContainer>
            ) : (
                <Button
                    sx={{

                    }}
                    component="span"
                    onClick={() => imgRef.current?.click()}
                >
                    Upload files
                </Button>
            )}
        </>
    )
}
