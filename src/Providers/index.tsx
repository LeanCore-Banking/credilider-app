"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "@/auth/AuthProvider";
import { getAwsConfig } from "@/auth/AuthProvider/aws-exports";
import { Amplify } from "aws-amplify";

type ProvidersProps = Readonly<{
    children: React.ReactNode;
}>;

const queryClient = new QueryClient();

const Providers = ({ children }: ProvidersProps) => {
    useEffect(() => {
        // Mover la configuración de Amplify dentro de useEffect
        getAwsConfig().then(config => {
            Amplify.configure(config);
        });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default Providers;