export type Moto = {
  id: number;
  timestamp: string;
  modelo: string;
  marcaTipo: string;
  color: string;
  precio: number;
  imagen: [];
  descripcion: string;
};


export type Quote = {
    initialFee: number;
    discount: number;
    financeValue: number;
    monthlyFee: number;
    annualEffectiveRate: number;
    monthlyCupDue: number;
    monthlyRate: number;
    monthLifeInsurance: number;
  };

  export type Lead = {
    name: string;
    nit: string;
    email: string;
    phone: string;
  };

  
