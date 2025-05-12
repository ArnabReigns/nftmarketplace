// app/@modal/(.)login/page.tsx
"use client";
import { Dialog } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginModal() {
    const router = useRouter();

    return (
        <Dialog open maxWidth='md' fullWidth>
            <h2>Login</h2>
            <button onClick={() => router.back()}>Close</button>
        </Dialog>
    );
}
