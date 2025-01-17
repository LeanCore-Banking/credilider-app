'use server';

import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

let token: string | null = null;
let tokenExpirationTime: number | null = null;
let simulatorToken: string | null = null;
let simulatorTokenExpirationTime: number | null = null;

// Función original para obtener el token de autenticación general
export async function getAuthToken(): Promise<string | null> {
  // Si ya existe un token y no ha expirado, lo reutiliza
  if (token && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return token;
  }

  try {
    const username = process.env.LC_API_KEY_USER || '';
    const password = process.env.LC_API_KEY || '';
    const url = `${process.env.AUTH_URL}/token?grant_type=client_credentials`;
    
    const credentials = `${username}:${password}`;
    const encodedToken = Buffer.from(credentials).toString('base64');
    
    const config = {
      method: 'post',
      url: url,
      headers: { 
        'Authorization': `Basic ${encodedToken}`
      }
    };

    const authResponse = await axios(config);
    token = authResponse.data.access_token;
    const expiresIn = authResponse.data.expires_in || 5600;
    tokenExpirationTime = Date.now() + expiresIn * 1000;

    return token;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}

// Nueva función para obtener el token del simulador
export async function getSimulatorAuthToken(): Promise<string | null> {
  if (simulatorToken && simulatorTokenExpirationTime && Date.now() < simulatorTokenExpirationTime) {
    return simulatorToken;
  }

  try {
    const username = process.env.LC_API_KEY_ID_SIMULATOR || '';
    const password = process.env.LC_API_KEY_SIMULATOR || '';
    const url = `${process.env.AUTH_URL}/token?grant_type=client_credentials`;
    
    const credentials = `${username}:${password}`;
    const encodedToken = Buffer.from(credentials).toString('base64');
    
    const config = {
      method: 'post',
      url: url,
      headers: { 
        'Authorization': `Basic ${encodedToken}`
      }
    };

    const authResponse = await axios(config);
    simulatorToken = authResponse.data.access_token;
    const expiresIn = authResponse.data.expires_in || 5600;
    simulatorTokenExpirationTime = Date.now() + expiresIn * 1000;

    return simulatorToken;
  } catch (error) {
    console.error("Error fetching simulator auth token:", error);
    return null;
  }
}