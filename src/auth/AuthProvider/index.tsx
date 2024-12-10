"use client";

import React, { createContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";

import {
    confirmSignIn,
    signIn,
    signOut,
    fetchAuthSession,
    fetchUserAttributes,
    type FetchUserAttributesOutput,
} from "aws-amplify/auth"
import { useRouter } from "next/navigation";
import { defaultUserAttributes, UserAttributes } from "@/types/auth";

type AuthContextType = {
    loading: boolean;
    attributes: UserAttributes;
    getAccessToken: () => Promise<string>;
    getCurrentFintech: () => string;
    signIn: (username: string, password: string) => Promise<void>;
    confirmSignIn: (
        code: string,
        fn: (token: string, attributes: UserAttributes) => Promise<void>
    ) => Promise<void>;
    signOut: () => Promise<void>;
    isLogged: () => boolean;
};

export const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [attributes, setAttributes] = useState<UserAttributes>(defaultUserAttributes);
    const [authNextStep, setAuthNextStep] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [JWT, setJWT] = useState<string>("");


    useEffect(() => {
        // Get the user's attributes and set them in state
        fetchUserAttributes()
            .then((res) => {
                const attrs = fromUserAttributesOutput(res);
                // console.log("[AuthProvider] attrs", attrs);
                setAttributes(attrs);
                setIsLoading(false);
                // router.replace("/dashboard");
            })
            .catch((err) => {
                setIsLoading(false);
                setAttributes(defaultUserAttributes);
                router.replace("/login");
            });
        // Get the JWT token and set it in state
        fetchAuthSession()
            .then((res) => {
                const jwt = res.tokens?.accessToken.toString();
                setJWT(jwt ?? "");
            })
            .catch((err) => {
                // console.log("[fetchAuthSession] err", err);
                setJWT("");
            });
    }, [router]);

    const _signIn = async (username: string, password: string) => {
        try {
            const { nextStep } = await signIn({ username, password });
            setAuthNextStep(nextStep.signInStep);
        } catch (error) {
            // console.log("[signIn] error signing in", error);
            throw error;
        }
    };

    const _confirmSignIn = async (
        code: string,
        // eslint-disable-next-line no-unused-vars
        fn: (token: string, attributes: UserAttributes) => Promise<void>
    ) => {
        try {
            if (authNextStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
                await confirmSignIn({ challengeResponse: code });
                const attributes = await fetchUserAttributes();
                const currentSession = await fetchAuthSession();
                const jwt = currentSession.tokens?.accessToken.toString();
                if (jwt) {
                    const attrs = fromUserAttributesOutput(attributes);
                    await fn(jwt, attrs);
                    setAttributes(attrs);
                    setJWT(jwt);
                }
            }
        } catch (error) {
            console.log("[confirmSignIn] error confirm signIn in", error);
            throw error;
        }
    };

    const _signOut = async () => {
        try {
            await signOut({ global: true });
            localStorage.clear();
            setJWT("");
            setAttributes(defaultUserAttributes);
            router.replace("/login");
        } catch (error) {
            localStorage.clear();
            setJWT("");
            setAttributes(defaultUserAttributes);
        }
    };

    const _getAccessToken = async () => {
        try {
            const currentSession = await fetchAuthSession();
            const jwt = currentSession.tokens?.accessToken.toString();
            return jwt ?? "";
        } catch (error) {
            return "";
        }
    };

    const _getCurrentFintech = () => {
        if (attributes["custom:feId"]) {
            return attributes["custom:feId"];
        }
        return "";
    };

    const _isLogged = () => {
        return attributes.email !== "" && JWT !== "";
    };

    /*  if (isLoading) {
         return <Image src={backgroundImage} alt="Background" className={styles.backgroundImage} />;
     } */

    return (
        <AuthContext.Provider
            value={{
                loading: isLoading,
                attributes,
                getAccessToken: _getAccessToken,
                getCurrentFintech: _getCurrentFintech,
                signIn: _signIn,
                confirmSignIn: _confirmSignIn,
                signOut: _signOut,
                isLogged: _isLogged,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const fromUserAttributesOutput = (attributes: FetchUserAttributesOutput) => {
    const newAttributes: UserAttributes = {
        "custom:feId": attributes["custom:feId"] || "",
        "custom:nit": attributes["custom:nit"] || "",
        "custom:role": attributes["custom:role"] || "",
        "custom:branch_office": attributes["custom:branch_office"] || "",
        email: attributes.email || "",
        name: attributes.name || "",
        phone_number: attributes.phone_number || "",
        phone_number_verified: attributes.phone_number_verified === "true",
        sub: attributes.sub || "",
    };
    return newAttributes;
};


export default dynamic(() => Promise.resolve(AuthProvider), {
    ssr: false,
});
