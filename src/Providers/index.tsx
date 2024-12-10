"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "@/auth/AuthProvider";
import { getAwsConfig } from "@/auth/AuthProvider/aws-exports";

import { Amplify } from "aws-amplify";

getAwsConfig().then(config => {
    Amplify.configure(config);
});

type ProvidersProps = Readonly<{
    children: React.ReactNode;
}>;

const queryClient = new QueryClient();

const Providers = ({ children }: ProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default Providers;
