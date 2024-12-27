"use server";
import { getAuthToken } from "./auth";
import { Lead, Moto, Quote, Email, PreAprobadoData, UpdateLead} from "./definitions";
import { createLeadPayload } from "./payloads";
import axios from "axios";
import { cotizacionHTML } from "./templates";
import dotenv from "dotenv";
import { send } from "process";
import useAuth from "@/auth/hooks";
import { ICreateLead } from "./mapper/user";

interface IUser {
  id: string;
}

dotenv.config();

export async function fetchQuotes(
  initialFee: number, // Cuota inicial
  discount: number, // % Descuento
  financeValue: number, // Valor a financiar
  name: string, // Nombre
  nit: string, // NIT o CC
  email: string, // Correo
  phone: string, // Teléfono
  motoData: Moto
): Promise<Quote[]> {
  try {
    // Artificial delay for demo purposes.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { id } = motoData;

    console.log("Fetching quote data...");
    console.log("motodata", motoData);
    console.log(
      `Name: ${name}, ${nit}, Email: ${email}, Phone: ${phone}, MotoId: ${id}`
    );

    const annualEffectiveRate = 0.16; // 16%
    const monthlyCupDue = 0.162; // 16.2%
    const monthLifeInsurance = 45000; // $45.000

    // This function should be fetch inside "credito simulation" endpoint from a proven method
    const calculateMonthlyFee = (
      financeValue: number,
      months: number,
      monthlyCupDue: number
    ) => {
      // Function to calculate monthly fee for development purposes only (not used in production)
      const monthlyRate = (1 + monthlyCupDue) ** (1 / 12) - 1;
      return (financeValue * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
    };

    // Calculate quotes for 24, 36, and 48 months
    const quote24Months: Quote = {
      initialFee,
      discount,
      financeValue,
      monthlyFee: calculateMonthlyFee(financeValue, 24, monthlyCupDue),
      annualEffectiveRate: annualEffectiveRate * 100,
      monthlyCupDue: monthlyCupDue * 100,
      monthlyRate: 24,
      monthLifeInsurance,
    };

    const quote36Months: Quote = {
      initialFee,
      discount,
      financeValue,
      monthlyFee: calculateMonthlyFee(financeValue, 36, monthlyCupDue),
      annualEffectiveRate: annualEffectiveRate * 100,
      monthlyCupDue: monthlyCupDue * 100,
      monthlyRate: 36,
      monthLifeInsurance,
    };

    const quote48Months: Quote = {
      initialFee,
      discount,
      financeValue,
      monthlyFee: calculateMonthlyFee(financeValue, 48, monthlyCupDue),
      annualEffectiveRate: annualEffectiveRate * 100,
      monthlyCupDue: monthlyCupDue * 100,
      monthlyRate: 48,
      monthLifeInsurance,
    };

    const quotes = [quote24Months, quote36Months, quote48Months];

    if (name && nit && email && phone) {
      // Save Lead to BD
      createLeadPayload.nit = nit;
      createLeadPayload.name = name;
      createLeadPayload.phone = phone;
      createLeadPayload.email = email;
      createLeadPayload.created_at = new Date().toISOString();

      const user = await getLeadByNit(nit);

      //console.log("user:", user);

      if (user.error === "Not Found") {
        console.log("Lead not found");
        //const leadSaved = await createLead(createLeadPayload)
        //console.log("leadSaved:", leadSaved);
      }else{
        console.log("User found");
        const updateLeadPayload = {
          id: user.id,
          name,
          nit,
          email,
          phone,
        };
        const leadUpdated = await updateLead(updateLeadPayload);
        console.log("leadUpdated:", leadUpdated);
      }

      //console.log("htlm:", cotizacionHTML(quotes, motoData));

      // Create PDF
      const pdf = await createPdf(cotizacionHTML(quotes, motoData), nit);
      console.log("pdf:", pdf);
      // console.log("PDF Created");
      // Send Email
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
    }

    return quotes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quote data.");
  }
}

export async function createLead(dataIn: any): Promise<any> {
  console.log("variables from createLead:", process.env.DEV_URL);
  console.log("dataIn:", dataIn);
  try {
    // Fetch the auth token using Basic Auth
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Failed to retreive auth token#####.");
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
    console.error("Error creating lead:", error);
    return false;
  }
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
    console.error("Error updating lead:", error);
    return false;
  }
}

export async function createPdf(
  template: string,
  nit: string
): Promise<{ [key: string]: any }> {
  try {
    // Fetch the auth token using Basic Auth

    console.log(".env:", process.env.PDF_URL);

    const response = await axios.post(
      `${process.env.PDF_URL}/lc-pdf-generator`,
      {
        returnURL: true,
        html: `<div>${template}</div>`,
        filepath: `${process.env.FINTEC_ID}/${process.env.USER_ID}/cotizaciones/${nit}`,
      }
    );

    //console.log("responsePDF", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating PDF:", error);
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
    console.error("Error sending email:", error);
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

    //console.log("user:", user);

    return user.data;
  } catch (error) {
    console.error("Error getting lead by nit:", formatAxiosError(error));
    return false;
  }
}

export async function generateOtp(dataIn: PreAprobadoData, userId: string): Promise<any> {

  try {
    const {cedula} = dataIn;


    const resp = {
      userId: userId,
      respSendOtp: "",
    };

    console.log("cedula", cedula);

    

    if (!cedula) {
      console.log("cedula is required", cedula);
    } 
     
      const response = await axios.post(`${process.env.DEV_URL}/send-otp`, {
        channel: "EMAIL",
        fintechId: "41b6f635-077f-4bba-93ce-faa1f469a987",
        userId: `${userId}`,
      });

      resp.respSendOtp = response.data;
      console.log("respSendOtp:", response.data);
    

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

    console.log("userIdOtp:", userId);

    const response = await axios.post(`${process.env.DEV_URL}/verify-otp`, {
      fintechId: "41b6f635-077f-4bba-93ce-faa1f469a987",
      userId: `${userId}`,
      OTP: `${otp}`,
      metadata: {
        ip: "192.168.128.1",
      },
      notify: false,
    });

    console.log("responseVerifyOtp:", response.data);

    resp.respVerifyOtp = response.data;

    if (response.data.status === "sent") {
      const responseCheck = await axios.get(
        `${process.env.DEV_URL}/check-otp/${userId}`
      );
      console.log("responseCheck:", responseCheck.data);
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
    const response = await axios.get(`${process.env.DEV_URL}/check-otp/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking opt:", error);
    return false;
  }
}


export const queryLead = async (userId: string): Promise<any> => {
  const token = await getAuthToken();
  const auth = useAuth();
  console.log("auth:", auth);
  const result = await axios.get("/lead", {
      params: {
          id: userId,
      },
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
  return result.data;
};

// Agregar esta función auxiliar
const formatAxiosError = (error: any) => {
  if (error.response) {
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message
    };
  }
  return {
    message: error.message,
    code: error.code
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
        return leadData.lead_status;
    } catch (error) {
        return "not_found";
    }
};