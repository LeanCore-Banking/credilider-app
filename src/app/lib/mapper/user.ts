export interface ICreateLead {
    image: string;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    nit: string;
    address: string;
    lead_status: string;
    created_at: string;
    business_entity: string;
    ecosystem: string;
    additional_data: {
      variables_data: IVariablesData[];
    };
  }
  
  export interface IVariablesData {
    key: string;
    value: string;
    type: string;
    label: string;
  }
  
  export interface IFormData {
    nombreApellido: string;
    telefono: string;
    email: string;
    cedula: string;
    tipoDocumento: string;
    fechaExpedicion: string;
    incomes: string;
    expenses: string;
    cuota_inicial: string;
    valor_financiar: string;
    'number-dependants': string;
    antiguedad_empresa: string;
    deudas_transito: string;
    deudas_actuales: string;
    contrato_laboral: string;
    icp: string;
  }
  
  export const userFormToData = (data: IFormData): Omit<ICreateLead, 'additional_data'> => {
    const [nombre, ...apellidos] = data.nombreApellido.split(' ');
    
    return {
      image: "",
      name: nombre?.trim() || "",
      lastname: apellidos?.join(' ').trim() || "",
      phone: data.telefono.trim(),
      email: data.email.trim(),
      nit: data.cedula.trim(),
      address: "-",
      lead_status: "not_assigned",
      created_at: new Date().toISOString(),
      business_entity: "natural",
      ecosystem: "873ddfa1-9d6c-4afc-803e-1e8b7e05835d"
    };
  };
  
  export const userFormToVariables = (data: IFormData): IVariablesData[] => {
    return [
      {
        key: "tipoDocumento",
        value: data.tipoDocumento,
        type: "string",
        label: "Tipo de identificación"
      },
      {
        key: "fechaExpedicion",
        value: data.fechaExpedicion,
        type: "date",
        label: "Fecha de expedición"
      },
      {
        key: "incomes",
        value: data.incomes,
        type: "number",
        label: "Ingresos"
      },
      {
        key: "expenses",
        value: data.expenses,
        type: "number",
        label: "Egresos"
      },
      {
        key: "cuota_inicial",
        value: data.cuota_inicial,
        type: "number",
        label: "Cuota inicial"
      },
      {
        key: "number-dependants",
        value: data['number-dependants'],
        type: "number",
        label: "Número de personas a cargo"
      },
      {
        key: "antiguedad_empresa",
        value: data.antiguedad_empresa,
        type: "array",
        label: "Antigüedad Empresa"
      },
      {
        key: "deudas_transito",
        value: data.deudas_transito,
        type: "number",
        label: "Deudas Transito"
      },
      {
        key: "deudas_actuales",
        value: data.deudas_actuales,
        type: "number",
        label: "Deudas Actuales"
      },
      {
        key: "contrato_laboral",
        value: data.contrato_laboral,
        type: "array",
        label: "Contrato laboral"
      },
      {
        key: "valor_financiar",
        value: data.valor_financiar,
        type: "number",
        label: "Valor a financiar"
      },
      {
        key: "icp",
        value: data.icp,
        type: "number",
        label: "ICP"
      }
    ];
  };