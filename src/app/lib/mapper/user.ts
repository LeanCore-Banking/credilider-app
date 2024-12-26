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
    cuotaInicial: string;
    numeroDependientes: string;
    antiguedadEmpresa: string;
    comparendosPendientes: string;
    deudasActuales: string;
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
      ecosystem: "89949613-2a1d-4b46-9961-4379d05b2fc6"
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
        type: "string",
        label: "Ingresos mensuales"
      },
      {
        key: "expenses",
        value: data.expenses,
        type: "string",
        label: "Egresos mensuales"
      },
      {
        key: "cuotaInicial",
        value: data.cuotaInicial,
        type: "string",
        label: "Cuota inicial"
      },
      {
        key: "numeroDependientes",
        value: data.numeroDependientes,
        type: "string",
        label: "Número de dependientes"
      },
      {
        key: "antiguedadEmpresa",
        value: data.antiguedadEmpresa,
        type: "string",
        label: "Antigüedad en la empresa"
      },
      {
        key: "comparendosPendientes",
        value: data.comparendosPendientes,
        type: "string",
        label: "Comparendos de tránsito pendientes"
      },
      {
        key: "deudasActuales",
        value: data.deudasActuales,
        type: "string",
        label: "Deudas actuales totales"
      }

    ];
  };