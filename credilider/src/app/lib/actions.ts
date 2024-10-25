"use server";
import { getAuthToken } from "./auth";
import { Lead, Moto, Quote, Email, PreAprobadoData } from "./definitions";
import { createLeadPayload } from "./payloads";
import axios from "axios";
import { cotizacionHTML } from "./templates";
import dotenv from "dotenv";
import { send } from "process";

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

      /*   const leadSaved = await createLead(createLeadPayload);
      if (leadSaved) {
        console.log("Lead Saved");
      } else {
        console.log("Lead Not Saved");
      } */

      console.log("htlm:", cotizacionHTML(quotes, motoData));

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

export async function createLead(
  dataIn: Lead
): Promise<any> {
  console.log("variables from createLead:", process.env.DEV_URL);
  try {
    // Fetch the auth token using Basic Auth
    const token = await getAuthToken();
    console.log("token:", dataIn);

    if (!token) {
      throw new Error("Failed to retreive auth token.");
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

    console.log("responsePDF", response.data);

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

    return user.data;
  } catch (error) {
    console.error("Error generating opt:", error);
    return false;
  }
}

export async function generateOtp(dataIn: PreAprobadoData): Promise<any> {
  try {
    const { nombreApellido, ingresos, telefono, email, cedula, tipoDocumento, egresos, fechaExpedicion, cuotaInicial } = dataIn;

    const resp = {
      userId: "",
      respSendOtp: "",
    };

    const user = await getLeadByNit(cedula)
    resp.userId = user.data.id

    if(user.data.error === 'Not Found'){
      createLeadPayload.name = nombreApellido;
      createLeadPayload.email= email
      createLeadPayload.phone=telefono

      const lead = await createLead(createLeadPayload)

      resp.userId= lead.data.id

      console.log('LeadFromOtp:' ,lead)
    }

  
   

    const response = await axios.post(`${process.env.DEV_URL}/send-otp`, {
      channel: "EMAIL",
      fintechId: "41b6f635-077f-4bba-93ce-faa1f469a987",
      userId: `${resp.userId}`,
    });

    resp.respSendOtp = response.data;

    return resp;
  } catch (error) {
    console.error("Error sending opt:", error);
    return false;
  }
}

export async function verifyOtp(otp: string, userId: string): Promise<any> {
  try {
    const resp = {
      respVerifyOtp: "",
      chekOptStatus: "",
    }


    const response = await axios.post(`${process.env.DEV_URL}/verify-otp`, {
      fintechId: "41b6f635-077f-4bba-93ce-faa1f469a987",
      userId: `${userId}`,
      OTP: `${otp}`,
      metadata: {
        ip: "192.168.128.1",
      },
      notify: false,
    });

    if (response.data.status === "sent") {
      const responseCheck = await axios.get(`${process.env.DEV_URL}/check-otp/${userId}`,);
      resp.chekOptStatus = responseCheck.data.status;
    }

    return resp;
  } catch (error) {
    console.error("Error validating opt:", error);
    return false;
  }
}
