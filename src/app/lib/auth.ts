'use server';
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

let token: string | null = null;
let tokenExpirationTime: number | null = null;

// Función para obtener el token de autenticación
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
    const session_url = url

    const config = {
      method: 'post',
      url: session_url,
      headers: { 'Authorization': 'Basic '+ encodedToken }
    };

    const authResponse = await axios(config);

    token = authResponse.data.access_token;

    //tiempo de expiración según la API
    const expiresIn = authResponse.data.expires_in || 5600; // tiempo en segundos
    console.log("Token expires in:", expiresIn, "seconds");

    // Establece el tiempo de expiración del token en milisegundos
    tokenExpirationTime = Date.now() + expiresIn * 1000;

    return token;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null; // Manejar el caso en el que no se pueda obtener el token
  }
}
