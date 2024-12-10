export type UserAttributes = {
    "custom:feId": string;
    "custom:nit": string;
    "custom:role": string;
    "custom:branch_office": string;
    email: string;
    name: string;
    phone_number: string;
    phone_number_verified: boolean;
    sub: string;
};

export const defaultUserAttributes: UserAttributes = {
    "custom:feId": "",
    "custom:nit": "",
    "custom:role": "",
    "custom:branch_office": "",
    email: "",
    name: "",
    phone_number: "",
    phone_number_verified: false,
    sub: "",
};
