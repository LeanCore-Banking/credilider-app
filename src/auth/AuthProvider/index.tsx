"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

import {
    confirmSignIn,
    signIn,
    signOut,
    fetchAuthSession,
    fetchUserAttributes,
    type FetchUserAttributesOutput,
    getCurrentUser,
} from "aws-amplify/auth"
import { useRouter } from "next/navigation";
import { defaultUserAttributes, UserAttributes } from "@/types/auth";
import { getAuthToken } from "@/app/lib/auth";
import { getAwsConfig } from "./aws-exports";

type AuthContextType = {
    loading: boolean;
    attributes: UserAttributes;
    getAccessToken: () => Promise<string>;
    getCurrentFintech: () => string;
    signIn: (username: string, password: string) => Promise<void>;
    signInML: (user: string, token: string) => Promise<void>;
    confirmSignIn: (
        code: string,
        fn: (token: string, attributes: UserAttributes) => Promise<void>
    ) => Promise<void>;
    signOut: () => Promise<void>;
    isLogged: () => boolean;
    getMagicLink: (username: string, fintechId: string) => Promise<any>;
};

export const AuthContext = createContext<AuthContextType>(null!);



export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const [attributes, setAttributes] = useState<UserAttributes>(defaultUserAttributes);
    const [authNextStep, setAuthNextStep] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [JWT, setJWT] = useState<string>("");

    useEffect(() => {
        getAwsConfig();
    }, []);

    // Verificar sesión al cargar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        console.log("checkAuth");
        try {
            // Verifica si hay un usuario actual
            const currentUser = await getCurrentUser();
            console.log("currentUser", currentUser);
            // Verifica si la sesión es válida
            const session = await fetchAuthSession();
            
            if (currentUser && session.tokens) {
                setIsAuthenticated(true);
                // Si hay sesión válida, redirigir a products
                router.replace('/products');
            }
        } catch (error) {
            console.log('No authenticated user');
            setIsAuthenticated(false);
            router.replace('/login');
        }
    };

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

    const _getMagicLink = async (username: string, fintechId: string) => {
        const token = await getAuthToken();
        console.log("username:", username);
        console.log("fintechId:", fintechId); 
        try {
            const response = await fetch('https://api.dev-middleware.leancore.co/magic-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username,
                    fintechId,
                }),
            });

            console.log("getMagicLink:", response);

            if (!response.ok) {
                throw new Error('Error al obtener magic link');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[getMagicLink] error:', error);
            throw error;
        }
    };

    const setup = useCallback(async () => {
        try {
            // Obtener atributos del usuario
            const attributes = await fetchUserAttributes();
            console.log("attributes--", attributes);
            const attrs = fromUserAttributesOutput(attributes);
            setAttributes(attrs);

            // Obtener sesión y JWT
            const currentSession = await fetchAuthSession();
            const jwt = currentSession.tokens?.accessToken.toString();
            setJWT(jwt ?? "");

            router.replace("/products");
        } catch (error) {
            console.log("[setup] error:", error);
            setAttributes(defaultUserAttributes);
            setJWT("");
            router.replace("/login");
        }
    }, [router]);

    const _signInML = useCallback(
        async (user: string, token: string) => {
            console.log("user_signInML:", user);
            try {
                // Agregamos un log para verificar la configuración
                console.log("Verificando configuración de Amplify...");
                
                const username = atob(user);
                // Agregamos validación adicional
                if (!username) {
                    throw new Error('Usuario no válido');
                }

                // Intentamos obtener la sesión actual primero para verificar la configuración
                try {
                    await fetchAuthSession();
                } catch (configError) {
                    console.error("Error de configuración de Amplify:", configError);
                    throw new Error('Error de configuración de autenticación');
                }

                const { nextStep } = await signIn({
                    username,
                    options: {
                        authFlowType: "CUSTOM_WITHOUT_SRP",
                    },
                });

                console.log("nextStep.signInStep:", nextStep.signInStep);
                
                if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE") {
                    await confirmSignIn({ challengeResponse: token });
                    await setup();
                }
            } catch (error) {
                console.error("[magicLinkSignIn] error detallado:", error);
                throw error;
            }
        },
        [setup]
    );

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
                signInML: _signInML,
                confirmSignIn: _confirmSignIn,
                signOut: _signOut,
                isLogged: _isLogged,
                getMagicLink: _getMagicLink,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

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
