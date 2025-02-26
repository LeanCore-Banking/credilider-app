"use client";

import { useState } from 'react';
import useAuth from '@/auth/hooks';
import { Button, Input } from "@mui/material";
import { useForm } from "react-hook-form";
import { PiUserCircle } from "react-icons/pi";
import './styles.css';

type FormValues = {
  username: string;
};

function LoginForm() {
  
  const { getMagicLink, signInML } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const methods = useForm<FormValues>({
    defaultValues: {
      username: "",
    },
  });

  // Manejar el login con magic link
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const fintechId =  "873ddfa1-9d6c-4afc-803e-1e8b7e05835d"//"89949613-2a1d-4b46-9961-4379d05b2fc6";

      // Solicitar magic link
      const res = await getMagicLink(data.username, fintechId);
      //console.log('res:', res);

      if (res?.link) {
        // Extraer user y token del link
        const params = new URLSearchParams(res.link);
        const user = params.get('user');
        const token = params.get('token');
        /* console.log('user:', user);
        console.log('token:', token); */

        if (user && token) {
          setErrorMessage("Iniciando sesión...");
          const ml = await signInML(user, token);
          //console.log('ML:', ml)
        } else {
          setErrorMessage("Error al procesar el magic link.");
        }
      } else {
        setErrorMessage("Error al iniciar sesión. Por favor, intente nuevamente.");
      }
    } catch (error) {
      console.error("[onSubmit] error", error);
      setErrorMessage("Error al iniciar sesión. Por favor, verifique sus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <h2>Bienvenido a Credilider</h2>
      </div>

      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <p>Correo electrónico</p>
        <div className="input-container">
          <PiUserCircle size={19} />
          <Input
            placeholder="Ingrese su correo"
            type="email"
            {...methods.register("username")}
          />
        </div>

        {errorMessage && (
          <div className={errorMessage.includes("Iniciando") ? "info-message" : "error-message"}>
            {errorMessage}
          </div>
        )}

        <div className="login-submit-button-container">
          <Button
            className="login-submit-button"
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {!loading ? "Iniciar sesión" : "Iniciando..."}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default LoginForm;
