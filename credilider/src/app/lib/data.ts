import { getAuthToken } from "./auth";
import { Lead, Moto, Quote } from "./definitions";
import axios from "axios";

export async function fetchMotos() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    /*  console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000)); */

    console.log("Fetching revenue data...");

    const response = await axios.get(
      `https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=listMotos`
    );
    return response.data;
    // console.log('Data fetch completed after 3 seconds.');
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fectchMotoById(id: string) {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    /* console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000)); */

    const response = await axios.get(
      `https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=getMotoById&id=${id}`
    );
    const data = response.data;
    //const moto = data.find((moto: { id: string }) => moto.id === id);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchQuotes(
  initialFee: number, // Cuota inicial
  discount: number, // % Descuento
  financeValue: number, // Valor a financiar
  name: string, // Nombre
  nit: string, // NIT o CC
  email: string, // Correo
  phone: string, // Teléfono
  motoData: Moto[]
): Promise<Quote[]> {
  try {
    // Artificial delay for demo purposes.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Fetching quote data...");
    console.log(
      `Name: ${name}, ${nit}, Email: ${email}, Phone: ${phone}, MotoId: ${motoData}`
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

    if (name && nit && email && phone) {
      // Save Lead to BD
      // Create PDF Template
      // Send Email to user with PDF
      const leadSaved = await createLead({
        name,
        nit,
        email,
        phone,
      });

      if (leadSaved) {
        console.log("Lead Saved");
      }
      // Create PDF

      // Send Email
    }

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

    return [quote24Months, quote36Months, quote48Months];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quote data.");
  }
}

export async function createLead(dataIn: Lead): Promise<boolean> {
  try {
    // Fetch the auth token using Basic Auth
    const token = getAuthToken();

    if (!token) {
      throw new Error("Failed to retreive auth token.");
    }

    const response = await axios.post(
      `${process.env.DEV_API_URL}/create-lead?bulk-load=false`,
      {
        dataIn,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Error creating lead:", error);
    return false;
  }
}

export async function createPdf(dataIn: Lead): Promise<boolean> {
  try {
    // Fetch the auth token using Basic Auth
    const token = getAuthToken();
    if (!token) {
      throw new Error("Failed to retreive auth token.");
    }

    await axios.post(
      `${process.env.DEV_API_URL}/create-pdf?bulk-load=false`,
      {
        dataIn,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Error creating PDF:", error);
    return false;
  }
}

export async function sendEmail(dataIn: Lead): Promise<boolean> {
  try {
    // Fetch the auth token using Basic Auth
    const token = getAuthToken();
    if (!token) {
      throw new Error("Failed to retreive auth token.");
    }

    await axios.post(
      `${process.env.DEV_API_URL}/send-email?bulk-load=false`,
      {
        dataIn,
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
