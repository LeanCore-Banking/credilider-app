"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useAuth from '@/auth/hooks';

export default function MagicLinkHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { signInML } = useAuth();

    useEffect(() => {
        if (searchParams.has("token") && searchParams.has("user")) {
            const token = searchParams.get("token")!;
            const user = searchParams.get("user")!;
            
            signInML(user, token)
                .then(() => {
                    router.push('/products?token=' + token + '&user=' + user);
                })
                .catch((error) => {
                    console.error('Error al iniciar sesión con magic link:', error);
                    router.push('/login');
                });
        }
    }, [searchParams, router, signInML]);

    return <div>Verificando credenciales...</div>;
}