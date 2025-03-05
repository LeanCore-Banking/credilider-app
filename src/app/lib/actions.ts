"use server";
import { getAuthToken, getSimulatorAuthToken } from "./auth";
import { Moto, Quote, Email, PreAprobadoData } from "./definitions";
import { createLeadPayload } from "./payloads";
import axios from "axios";
import { cotizacionHTML } from "./templates";
import dotenv from "dotenv";
import useAuth from "@/auth/hooks";
import * as Sentry from "@sentry/nextjs";
import { ServerActionError, createServerAction } from "./action-utils";

interface IUser {
  id: string;
}

dotenv.config();

interface LoanProduct {
  name: string;
  loan_type: string;
  interest_rate: number;
  interest_rate_basis: string;
  other_expenses: any[];
  payment_frequency: string;
  grace_period: number;
  billing_interval_type: string;
  arrear_interest_rate: number;
  arrear_interest_rate_basis: string;
  arrear_max_interest_rate: number;
}

export const fetchQuotesAction = createServerAction(async (
  initialFee: number,
  discount: number,
  documentos: number,
  financeValue: number,
  name: string,
  nit: string,
  email: string,
  phone: string,
  motoData: Moto,
  financialEntityId: string
): Promise<Quote[]> => {
  console.log("[financialEntityId]----:", financialEntityId);
  try {
    // Obtener token de autorización para el simulador
    const simulatorToken = await getSimulatorAuthToken();
    if (!simulatorToken) {
      throw new ServerActionError("No se pudo obtener el token de autenticación del simulador.");
    }

    const token = await getAuthToken();
    if (!token) {
      throw new ServerActionError("No se pudo obtener el token de autenticación.");
    }

    // Obtener datos de Fintech usando el ID recibido
    const fintechData = await dataFintech(token, financialEntityId);
    const loanProduct = Object.values(
      fintechData.loan_products as Record<string, LoanProduct>
    ).find((product) => product.name === "simulador");

    if (!loanProduct) {
      throw new ServerActionError("Producto de préstamo no encontrado");
    }
    console.log("[loanProductRate]:", loanProduct.interest_rate);
    // Preparar payload base
    const basePayload = {
      user_id: null,
      financial_entity_id: process.env.FINTECH_ID,
      loan_product_name: loanProduct.name,
      loan_type: loanProduct.loan_type,
      amount: financeValue * 100,
      interest_rate: loanProduct.interest_rate ,
      interest_rate_basis: "monthly",
      other_expenses: loanProduct.other_expenses,
      payment_frequency: loanProduct.payment_frequency,
      assignment_date: new Date(),
      cut_off_date: new Date(),
      grace_period: loanProduct.grace_period,
      billing_interval_type: loanProduct.billing_interval_type,
      arrear_interest_rate: loanProduct.arrear_interest_rate,
      arrear_interest_rate_basis: loanProduct.arrear_interest_rate_basis,
      arrear_max_interest_rate: loanProduct.arrear_max_interest_rate,
    };

    console.log("[basePayload]:", basePayload);

    // Crear las tres simulaciones con diferentes plazos
    const simulationPromises = [24, 36, 48].map((term) =>
      axios.post(
        `${process.env.DEV_URL}/simulate-loan`,
        {
          ...basePayload,
          term,
        },
        {
          headers: {
            Authorization: `Bearer ${simulatorToken}`,
          },
        }
      )
    );

    // Ejecutar todas las simulaciones en paralelo
    const simulationResults = await Promise.all(simulationPromises);
    console.log("[simulationResults]:", simulationResults[0].data);

    // Transformar resultados a formato Quote[]
    const quotes: Quote[] = simulationResults.map((result, index) => {
      const simulationData = result.data;
      return {
        initialFee,
        discount,
        financeValue,
        documentos,
        monthlyFee: (simulationData?.payment_amount || 0) / 100,
        annualEffectiveRate: simulationData.annual_effective_rate,
        monthlyCupDue: simulationData.interest_rate,
        monthlyRate: [24, 36, 48][index],
        monthLifeInsurance:
          (simulationData.other_expenses?.[0]?.amount || 0) / 100,
      };
    });

    // Guardar lead si se proporcionaron datos de usuario
    if (name && nit && email && phone) {
      // Save Lead to BD
      createLeadPayload.nit = nit;
      createLeadPayload.name = name;
      createLeadPayload.phone = phone;
      createLeadPayload.email = email;
      createLeadPayload.created_at = new Date().toISOString();

      const user = await getLeadByNit(nit);

      if (user.error === "Not Found") {
        const leadSaved = await createLead(createLeadPayload);
      } else {
        const updateLeadPayload = {
          id: user.id,
          name,
          nit,
          email,
          phone,
        };
        const leadUpdated = await updateLead(updateLeadPayload);
      }

      try {
        const pdf = await createPdf(cotizacionHTML(quotes, motoData), nit);
        if (pdf.url) {
          await sendEmail({
            template_name: "cotizacion", // Constante
            destination: `${email}`,
            template_data: {
              nombreUsuario: `${name}`,
              modeloMoto: `${motoData.marcaTipo} ${motoData.modelo}`,
              urlCotizacion: `${pdf.url}`,
            },
          });
        }
      } catch (error) {
        throw new ServerActionError("Error al crear el PDF o enviar el correo.");
      }
    }

    return quotes;
  } catch (error: any) {
    Sentry.captureException(error);
    console.error("Error en fetchQuotes:", error.response?.data || error);
    
    if (error instanceof ServerActionError) {
      throw error;
    }
    
    // Obtener más detalles del error
    let errorMessage = "Error al obtener las cotizaciones. ";
    
    if (axios.isAxiosError(error)) {
      // Error de red o respuesta del servidor
      if (error.response) {
        // El servidor respondió con un estado de error
        switch (error.response.status) {
          case 400:
            errorMessage += "Los datos proporcionados no son válidos. ";
            break;
          case 401:
            errorMessage += "No está autorizado para realizar esta operación. ";
            break;
          case 404:
            errorMessage += "No se encontró el recurso solicitado. ";
            break;
          case 500:
            errorMessage += "Error interno del servidor. ";
            break;
          default:
            errorMessage += `Error del servidor (${error.response.status}). `;
        }
        
        // Agregar detalles específicos si están disponibles
        if (error.response.data?.message) {
          errorMessage += `Detalle: ${error.response.data.message}`;
        }
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        errorMessage += "No se pudo conectar con el servidor. Verifique su conexión a internet. ";
      } else {
        // Error al configurar la solicitud
        errorMessage += "Error al procesar la solicitud. ";
      }
    } else {
      // Error no relacionado con Axios
      errorMessage += error.message || "Error inesperado. ";
    }

    errorMessage ;
    
    throw new ServerActionError(errorMessage);
  }
});

export async function fetchQuotes(
  initialFee: number,
  discount: number,
  documentos: number,
  financeValue: number,
  name: string,
  nit: string,
  email: string,
  phone: string,
  motoData: Moto,
  financialEntityId: string
): Promise<Quote[] | { error: string; statusCode: number }> {
  try {
    const result = await fetchQuotesAction(
      initialFee,
      discount,
      documentos,
      financeValue,
      name,
      nit,
      email,
      phone,
      motoData,
      financialEntityId
    );
    
    if (!result.success) {
      return {
        error: result.error,
        statusCode: 500,
      };
    }
    
    return result.value;
  } catch (error: any) {
    Sentry.captureException(error);
    console.error("Error en fetchQuotes:", error);
    return {
      error: "Error al obtener las cotizaciones." + error,
      statusCode: 500,
    };
  }
}

export async function createLead(dataIn: any): Promise<any> {
  // console.log("variables from createLead:", process.env.DEV_URL);
  // console.log("dataIn:", dataIn);
  try {
    // Fetch the auth token using Basic Auth
    const token = await getAuthToken();

    if (!token) {
      return {
        error: "Failed to retrieve auth token.",
        statusCode: 401,
      };
    }

    const response = await axios.post(
      `${process.env.DEV_URL}/create-lead?bulk-load=false`,
      {
        ...dataIn,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    /*  Sentry.captureException(error);
    console.error("Error creating lead:", error); */
    console.log("error al crear lead", formatAxiosError(error));
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
      const errorMessage = error.response?.data.message;
      return {
        error: traslateError(errorMessage),
        statusCode: error.response?.status || 500,
      };
    }

    return {
      error: "Error inesperado",
      statusCode: 500,
    };
  }
}

function traslateError(message: string) {
  // Verificar si el mensaje contiene "User with nit"
  if (message.includes("User with nit:")) {
    return "El usuario ya existe";
  }

  const traducciones: { [key: string]: string } = {
    "User already exists": "El usuario ya existe",
    "Invalid Data": "Datos inválidos",
    "Not Found": "No se encontró el usuario",
    "Bad Request": "Solicitud incorrecta",
  };
  return traducciones[message] || "Ha ocurrido un error inesperado";
}

export async function updateLead(req: any): Promise<any> {
  const { userId, dataIn } = req;
  try {
    // Fetch the auth token using Basic Auth
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Failed to retreive auth token.");
    }

    const response = await axios.post(
      `${process.env.DEV_URL}/update-lead`,
      {
        id: userId,
        ...dataIn,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating lead:", formatAxiosError(error));
    return false;
  }
}

export async function createPdf(
  template: string,
  nit: string
): Promise<{ [key: string]: any }> {
  try {
    // Fetch the auth token using Basic Auth
    // console.log(".env:", process.env.PDF_URL);

    const response = await axios.post(
      `${process.env.PDF_URL}/lc-pdf-generator`,
      {
        returnURL: true,
        html: `<div>${template}</div>`,
        filepath: `${process.env.USER_ID}/${nit}`,
      }
    );

    // console.log("responsePDF", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating PDF:", formatAxiosError(error));
    return {};
  }
}

export async function sendEmail(dataIn: Email): Promise<boolean> {
  try {
    // Fetch the auth token
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Failed to retreive auth token.");
    }

    await axios.post(
      `${process.env.DEV_URL}/templated-email`,
      {
        ...dataIn,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Error sending email:", formatAxiosError(error));
    return false;
  }
}

export async function getLeadByNit(id: string): Promise<any> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Failed to retrieve auth token.");
    }

    const user = await axios.get(`${process.env.DEV_URL}/lead?nit=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("user:", user);

    return user.data;
  } catch (error) {
    console.error("Error getting lead by nit:", formatAxiosError(error));
    return false;
  }
}

export async function generateOtp(
  dataIn: PreAprobadoData,
  userId: string
): Promise<any> {
  try {
    const { cedula } = dataIn;

    const resp = {
      userId: userId,
      respSendOtp: "",
    };

    // console.log("cedula", cedula);

    if (!cedula) {
      // console.log("cedula is required", cedula);
    }

    const response = await axios.post(`${process.env.DEV_URL}/send-otp`, {
      channel: "EMAIL",
      fintechId: "41b6f635-077f-4bba-93ce-faa1f469a987",
      userId: `${userId}`,
    });

    resp.respSendOtp = response.data;
    // console.log("respSendOtp:", response.data);

    return resp;
  } catch (error) {
    console.error("Error sending opt:", error);
    return false;
  }
}

export async function verifyAndCheckOtp(
  otp: string,
  userId: string
): Promise<any> {
  try {
    const resp = {
      respVerifyOtp: "",
      chekOptStatus: "",
    };

    // console.log("userIdOtp:", userId);

    const response = await axios.post(`${process.env.DEV_URL}/verify-otp`, {
      fintechId: "41b6f635-077f-4bba-93ce-faa1f469a987",
      userId: `${userId}`,
      OTP: `${otp}`,
      metadata: {
        ip: "192.168.128.1",
      },
      notify: false,
    });

    // console.log("responseVerifyOtp:", response.data);

    resp.respVerifyOtp = response.data;

    if (response.data.status === "sent") {
      const responseCheck = await axios.get(
        `${process.env.DEV_URL}/check-otp/${userId}`
      );
      // console.log("responseCheck:", responseCheck.data);
      resp.chekOptStatus = responseCheck.data;
    }

    return resp;
  } catch (error) {
    console.error("Error validating opt:", error);
    return false;
  }
}

export async function checkOtp(userId: string, token: string): Promise<any> {
  try {
    const response = await axios.get(
      `${process.env.DEV_URL}/check-otp/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking opt:", formatAxiosError(error));
    return false;
  }
}

export const queryLead = async (userId: string): Promise<any> => {
  try {
    const token = await getAuthToken();

    const result = await axios.get(`${process.env.DEV_URL}/lead`, {
      params: {
        id: userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.error("Error en queryLead:", formatAxiosError(error));
    return null;
  }
};

// Agregar esta función auxiliar
export const formatAxiosError = (error: any) => {
  if (error.response) {
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
    };
  }
  return {
    message: error.response?.data.message,
    code: error.response?.data.code,
  };
};

export const queryUser = async (req: any): Promise<IUser | null> => {
  const { userId, token } = req;
  try {
    console.log("userIdFromQueryUser:", userId);
    const result = await axios.get(`${process.env.DEV_URL}/user`, {
      params: {
        id: userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("resultFromQueryUser:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error al consultar usuario:", formatAxiosError(error));
    return null;
  }
};

export const checkLeadStatus = async (userId: string) => {
  try {
    const leadData = await queryLead(userId);

    if (!leadData) {
      return "not_found";
    }
    console.log("leadData", leadData);
    return leadData.lead_status;
  } catch (error) {
    console.log("error queryLead", formatAxiosError(error));
    return "not_found";
  }
};

export const dataFintech = async (token: string, fintechId: string) => {
  console.log("fintechidFromDataFintech--", fintechId);
  const result = await axios.get(`${process.env.DEV_URL}/financial-entity`, {
    params: {
      uid: fintechId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data;
};

interface ICPCalculation {
  icp: string;
  cuota_mensual: string;
  cuotas_actuales_total: string;
  obligaciones_mensuales: {
    deudas_actuales: string;
    deudas_transito: string;
    gastos_mensuales: string;
    cuota_nuevo_credito: string;
  };
}

export const calculateICPWithSimulationLoanAction = createServerAction(async (
  valorFinanciar: string,
  cuotas: string,
  ingresos: string,
  gastosMensuales: string,
  deudasActuales: string,
  deudasTransito: string,
  financialEntity: string
): Promise<ICPCalculation> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new ServerActionError("No se pudo obtener el token de autenticación");
    }

    // Convertir el valor a financiar a centavos (multiplicar por 100)
    const valorFinanciarCentavos = parseFloat(valorFinanciar) * 100;

    // 1. Obtener datos de Fintech
    const fintechData = await dataFintech(token, financialEntity);
    const loanProduct = Object.values(
      fintechData.loan_products as Record<string, LoanProduct>
    ).find((product) => product.name === "simulador");
    if (!loanProduct) {
      throw new ServerActionError("Producto de préstamo no encontrado");
    }

    // 2. Preparar payload para simulación
    const simulationPayload = {
      user_id: null,
      financial_entity_id: '873ddfa1-9d6c-4afc-803e-1e8b7e05835d',
      loan_product_name: loanProduct.name,
      loan_type: loanProduct.loan_type,
      amount: valorFinanciarCentavos,
      interest_rate: loanProduct.interest_rate,
      interest_rate_basis: "monthly",
      other_expenses: loanProduct.other_expenses,
      payment_frequency: loanProduct.payment_frequency,
      assignment_date: new Date(),
      cut_off_date: new Date(),
      grace_period: loanProduct.grace_period,
      billing_interval_type: loanProduct.billing_interval_type,
      arrear_interest_rate: loanProduct.arrear_interest_rate,
      arrear_interest_rate_basis: loanProduct.arrear_interest_rate_basis,
      arrear_max_interest_rate: loanProduct.arrear_max_interest_rate,
      term: parseInt(cuotas),
    };

    const simulatorToken = await getSimulatorAuthToken();
    if (!simulatorToken) {
      throw new ServerActionError("No se pudo obtener el token de autenticación del simulador");
    }

    // 3. Realizar simulación del crédito
    const simulationResult = await axios.post(
      `${process.env.DEV_URL}/simulate-loan`,
      simulationPayload,
      {
        headers: {
          Authorization: `Bearer ${simulatorToken}`,
        },
      }
    );

    // 4. Calcular ICP
    const ingresosMensuales = parseFloat(ingresos);
    const gastosMensualesNum = parseFloat(gastosMensuales) || 0;
    const deudasActualesNum = parseFloat(deudasActuales) || 0;
    const deudasTransitoNum = parseFloat(deudasTransito) || 0;
    const cuotaNuevoCredito = simulationResult.data.payment_amount / 100;
    const cuotasActuales =
      deudasActualesNum + deudasTransitoNum + gastosMensualesNum;

    const icp = (cuotaNuevoCredito + cuotasActuales) / ingresosMensuales;

    return {
      icp: icp.toFixed(4),
      cuota_mensual: cuotaNuevoCredito.toString(),
      cuotas_actuales_total: cuotasActuales.toString(),
      obligaciones_mensuales: {
        deudas_actuales: deudasActualesNum.toString(),
        deudas_transito: deudasTransitoNum.toString(),
        gastos_mensuales: gastosMensualesNum.toString(),
        cuota_nuevo_credito: cuotaNuevoCredito.toString(),
      },
    };
  } catch (error: any) {
    console.error(
      "Error en el cálculo del ICP:",
      error.response?.data || error
    );
    
    if (error instanceof ServerActionError) {
      throw error;
    }
    
    throw new ServerActionError("Error en el cálculo del ICP");
  }
});

export async function calculateICPWithSimulationLoan(
  valorFinanciar: string,
  cuotas: string,
  ingresos: string,
  gastosMensuales: string,
  deudasActuales: string,
  deudasTransito: string,
  financialEntity: string
): Promise<ICPCalculation> {
  try {
    const result = await calculateICPWithSimulationLoanAction(
      valorFinanciar,
      cuotas,
      ingresos,
      gastosMensuales,
      deudasActuales,
      deudasTransito,
      financialEntity
    );
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result.value;
  } catch (error: any) {
    console.error("Error en calculateICPWithSimulationLoan:", error);
    throw error;
  }
}
