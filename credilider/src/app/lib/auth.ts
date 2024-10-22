import axios from "axios";

let token: string | null = null;
let tokenExpirationTime: number | null = null;

// Función para obtener el token de autenticación
export async function getAuthToken(): Promise<string | null> {
  // Si ya existe un token y no ha expirado, lo reutilizamos
  if (token && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return token;
  }

  try {
    const authResponse = await axios.post(
      `${process.env.AUTH_URL}/token?grant_type=client_credentials`,
      {},
      {
        auth: {
          username: process.env.LC_API_KEY_USER || "",
          password: process.env.LC_API_KEY || "",
        },
      }
    );

    token = authResponse.data.token;

    //tiempo de expiración según la API
    const expiresIn = authResponse.data.expires_in || 3600; // tiempo en segundos
    console.log("Token expires in:", expiresIn, "seconds");

    // Establece el tiempo de expiración del token en milisegundos
    tokenExpirationTime = Date.now() + expiresIn * 1000;

    return token;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null; // Manejar el caso en el que no se pueda obtener el token
  }
}
