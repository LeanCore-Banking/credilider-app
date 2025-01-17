"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useAuth from '@/auth/hooks';
import ResponsiveHeader from '@/components/Header/Index';
import Products from './products/page';


export default function Home() {
    return (
        <>
            <ResponsiveHeader/>  
            <Products/>
        </>
    );
}

