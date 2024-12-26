"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/auth/hooks';
import { Button, Input } from "@mui/material";
import { useForm } from "react-hook-form";
import { PiUserCircle } from "react-icons/pi";
import { IoLockClosedOutline } from "react-icons/io5";
import { MuiOtpInput } from "mui-one-time-password-input";
import './styles.css';

type FormValues = {
    username: string;
    password: string;
};

function LoginForm() {
  const router = useRouter();
  const { signIn, confirmSignIn, signOut } = useAuth();
  const [waitingOTP, setWaitingOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const methods = useForm<FormValues>({
        defaultValues: {
            username: "",
            password: "",
        },
    });


    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            //cerrar cualquier sesión existente
            try {
                await signOut();
            } catch (error) {
                // Ignora errores al cerrar sesión
                console.log("[onSubmit] signOut error", error);
            }
            // intentar iniciar sesión
            await signIn(data.username, data.password);
            setLoading(false);
            setWaitingOTP(true);
        } catch (error) {
            setLoading(false);
            setWaitingOTP(false);
            console.log("[onSubmit] error", error);
        }
    };

    const handleChange = (newValue: string) => {
        setOtp(newValue);
    };


    const handleConfirm = async () => {
        try {
            setLoading(true);
            await confirmSignIn(otp, async (token, attributes) => {
                // console.log("[handleConfirm] token", token);
                // console.log("[handleConfirm] attributes", attributes);
                router.push("/");
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("[handleConfirm] error", error);
        }
    };

    const onReturn = () => {
        setWaitingOTP(false);
    };


  return (
    <div className="login-container">
      <div className="header">
        <h2>Bienvenido a Credilider</h2>
      </div>
      {!waitingOTP && (
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <p>Usuario</p>
          <div className="input-container">
            <PiUserCircle size={19} />
            <Input
              placeholder="Ingrese usuario"
              {...methods.register("username")}
            />
          </div>
          
          <p>Contraseña</p>
          <div className="input-container">
            <IoLockClosedOutline size={19} />
            <Input
              type="password"
              {...methods.register("password")}
              placeholder="Ingrese contraseña"
            />
          </div>

          <Button
            className="login-submit-button"
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {!loading ? "Ingresar" : "Cargando..."}
          </Button>
        </form>
      )}
      
      {waitingOTP && (
        <div className="otp-container">
          <MuiOtpInput value={otp} onChange={handleChange} length={6} />
          <div className="buttons-container">
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={handleConfirm}
              disabled={otp.length !== 6 || loading}
            >
              {!loading ? "Confirmar" : "Cargando..."}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={onReturn}
              disabled={loading}
            >
              Regresar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
