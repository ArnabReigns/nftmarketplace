'use client';

import { useMArketContract } from '@/hooks/useMarketContract';
import { useContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet';
import { IToken } from '@/model/nft';
import { IUser } from '@/model/user';
import axios from 'axios';
import { ethers } from 'ethers';
import React, { useState, useEffect, ReactNode, useContext } from 'react';

interface AppContextInterface {
    address: string | null,
    nftContract: ethers.Contract | null,
    marketContract: ethers.Contract | null,
    user: IUser | null
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>
    userLoading: boolean
    triggerRefresh: (tag: string) => void
    refreshMap: RefreshMap
}

const AppContext = React.createContext<AppContextInterface | null>(null);
type RefreshMap = Record<string, number>;

export const AppProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(true)
    const { address } = useWallet()
    const { contract: nftContract } = useContract(address)
    const { contract: marketContract } = useMArketContract(address)


    const [refreshMap, setRefreshMap] = useState<RefreshMap>({});

    const triggerRefresh = (tag: string) => {
        setRefreshMap(prev => ({
            ...prev,
            [tag]: (prev[tag] || 0) + 1,
        }));
    };



    async function fetchUser() {
        const res = await axios.get("/api/getUser", { params: { address } })
        console.log(res.data);
        return res.data;
    }


    useEffect(() => {
        if (address) {
            fetchUser().then((user: IUser) => {
                if (user) setUser(user)
            }).catch((err) => console.error(err)).finally(() => setLoading(false))
        }
    }, [address])

    return (
        <AppContext.Provider value={{ address, nftContract, marketContract, user, setUser, refreshMap, triggerRefresh, userLoading: loading }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === null) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
