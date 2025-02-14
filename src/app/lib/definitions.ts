import { strict } from "assert";

export type Moto = {
  id: number;
  timestamp: string;
  modelo: string;
  marcaTipo: string;
  color: string;
  precio: number;
  imagen: [];
  descripcion: string;
  garantia: number;
};

export type Email = {
  template_name: string;
  destination: string;
  template_data: {
    nombreUsuario: string;
    modeloMoto: string;
    urlCotizacion: string;
  };
};


export type Quote = {
    initialFee: number;
    discount: number;
    financeValue: number;
    documentos: number;
    monthlyFee: number;
    annualEffectiveRate: number;
    monthlyCupDue: number;
    monthlyRate: number;
    monthLifeInsurance: number;
  };

  export type QuoteResponse = {
    error: boolean;
    quotes: Quote[];
  };

  export type Lead = {
    name: string;
    nit: string;
    email: string;
    phone: string;
  };

  export type UpdateLead = {
    id: string;
    name: string;
    nit: string;
    email: string;
    phone: string;
  };

  export type PreAprobadoData = {
    nombreApellido: string;
    incomes: string;
    telefono: string;
    email: string;
    cedula: string;
    tipoDocumento: string;
    expenses: string;
    fechaExpedicion: string;
    cuota_inicial: string;
  };

  
