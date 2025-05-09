'use client';

import { useWallet } from '@/hooks/useWallet';
import { redirect } from 'next/navigation';

export default function ProfileRedirect() {

    const { address } = useWallet();

    if (address) redirect('/profile/'+address);

    return <></>
}