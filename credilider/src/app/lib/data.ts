//import { sql } from '@vercel/postgres';
import { motos } from "./definitions";
import { Quote } from "./definitions";
import axios from 'axios';

export async function fetchMotos() {
    try {
      // Artificially delay a response for demo purposes.
      // Don't do this in production :)
  
      console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      const response = await axios.get(
        `https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=listMotos`
      );
      return response.data;
  
      // console.log('Data fetch completed after 3 seconds.');
  
      //return data.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch revenue data.');
    }
  }

  export async function fectchMotoById(id: string) {
    try {
      // Artificially delay a response for demo purposes.
      // Don't do this in production :)
  
      console.log('Fetching revenue data...');
     // await new Promise((resolve) => setTimeout(resolve, 3000));
  
      const response = await axios.get(
        `https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=getMotoById&id=${id}`
      );
      const data = response.data;

      
  
      //const moto = data.find((moto: { id: string }) => moto.id === id);
  
      return data;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch revenue data.');
    }
  }

  
  export async function fetchQuotes(
    initialFee: number, // Cuota inicial
    discount: number, // % Descuento
    financeValue: number, // Valor a financiar
    name: string, // Nombre
    email: string, // Correo
    phone: string // Teléfono
  ): Promise<Quote[]> {
    try {
      // Artificial delay for demo purposes.
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      console.log('Fetching quote data...');
      console.log(`Name: ${name}, Email: ${email}, Phone: ${phone}`);
  
      const annualEffectiveRate = 0.16; // 16%
      const monthlyCupDue = 0.162; // 16.2%
      const monthLifeInsurance = 45000; // $45.000
  
      // Function to calculate monthly fee
      const calculateMonthlyFee = (
        financeValue: number,
        months: number,
        monthlyCupDue: number
      ) => {
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
        monthLifeInsurance
      };
  
      const quote36Months: Quote = {
        initialFee,
        discount,
        financeValue,
        monthlyFee: calculateMonthlyFee(financeValue, 36, monthlyCupDue),
        annualEffectiveRate: annualEffectiveRate * 100,
        monthlyCupDue: monthlyCupDue * 100,
        monthlyRate: 36,
        monthLifeInsurance
      };
  
      const quote48Months: Quote = {
        initialFee,
        discount,
        financeValue,
        monthlyFee: calculateMonthlyFee(financeValue, 48, monthlyCupDue),
        annualEffectiveRate: annualEffectiveRate * 100,
        monthlyCupDue: monthlyCupDue * 100,
        monthlyRate: 48,
        monthLifeInsurance
      };
  
      return [quote24Months, quote36Months, quote48Months];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch quote data.');
    }
  }
  