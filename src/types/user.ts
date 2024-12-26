export interface IAdditionalData {
    variables_data: IVariablesData[];
    idType?: string;
    expeditionDate?: string;
}


export interface IVariablesData {
    // [key: string]: string;
    key: string;
    value: string | number | boolean;
    type: string;
    label: string;
    values?: string;
}

export interface ILead {
    id: string;
    image: string;
    name: string;
    lastname: string;
    business_name: string;
    phone: string;
    email: string;
    nit: string;
    address: string;
    lead_status:
        | "not_assigned"
        | "contacted"
        | "filled_out_form"
        | "discarded"
        | "not_contacted"
        | "pre_approved";
    status?: string;
    records: {
        [key: string]: string;
    }[];
    created_at: string;
    loan_priority: number;
    ecosystem: string;
    business_entity: string;
    additional_data: IAdditionalData;
    branch_office?: string;
}