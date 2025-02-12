'use server'

export const getAwsConfig = async () => {
    if (!process.env.AUTH_AWS_USER_POOL_ID) {
        throw new Error('AUTH_AWS_USER_POOL_ID no está definido');
    }
    if (!process.env.AUTH_AWS_USER_POOL_WEB_CLIENT_ID) {
        throw new Error('AUTH_AWS_USER_POOL_WEB_CLIENT_ID no está definido');
    }
    if (!process.env.AUTH_AWS_REGION) {
        throw new Error('AUTH_AWS_REGION no está definido');
    }

    return {
        Auth: {
            Cognito: {
                userPoolId: process.env.AUTH_AWS_USER_POOL_ID,
                userPoolClientId: process.env.AUTH_AWS_USER_POOL_WEB_CLIENT_ID,
                region: process.env.AUTH_AWS_REGION,
                loginWith: {
                    username: true,
                    email: true,
                    phone: false
                }
            }
        }
    };
};
