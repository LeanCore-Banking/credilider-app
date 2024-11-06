'use client'
import useFormStore from '@/store/UseFormStore';
import { useRouter } from 'next/navigation';
import './styles.css';
import '../solicitud-credito/index.css';
import { useState } from 'react';
import ProgressBar from '@/components/ProgressBar/Index';
import { robotoCondensed } from '@/app/fonts/fonts';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import PopupSlider from '@/components/DialogOptions/Index';
import { generateOtp, verifyAndCheckOtp } from '@/app/lib/actions';

interface FormData {
  nombre: string;
  apellido: string;
  [key: string]: string;
}

const PreaprobadoForm = () => {
  const [popUpOtpOpen, setPopUpOtp] = useState(false);
  const [responseOtp, setOtpResponse] = useState<{ userId: string, respSendOtp: string } | null>(null);
  const [response, setResponse] = useState('');
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombreApellido: '',
    ingresos: '',
    telefono: '',
    email: '',
    cedula: '',
    tipoDocumento: 'CC',
    egresos: '',
    fechaExpedicion: '',
    cuotaInicial: '',
    otp: ''
  });

  const preAprobadoBtnHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem('formData', JSON.stringify(formData));

    // Simulación de una llamada a un endpoint
    /*  const response = await new Promise(resolve =>
       setTimeout(() => resolve(`$${Math.floor(Math.random() * 100000)}`), 1000)
     ) */
    const otpResp = await generateOtp(formData);
    console.log('otpResp:', otpResp)  
    setPopUpOtp(true);
    setOtpResponse({ userId: otpResp.userId, respSendOtp: otpResp.respSendOtp });
    //setResponse(response as string);
  };

  const otpSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    const otp = formData.otp
    console.log('otpFromOtpSubmit:', responseOtp)

    if (responseOtp) {
      const response = await verifyAndCheckOtp(otp, responseOtp.userId);
      console.log('responseVeriFyAndCheckOpt:', response)
      setResponse(response.chekOptStatus)
    }

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({ ...prev, tipoDocumento: value }));
  };

  const handleCloseBtn = () => {
    setPopUpOtp(false);
    setResponse('');
  }

  return (
    <div className={`${robotoCondensed.className}`}>
      <div className='pre-aprobado-container'>
        <div className='pre-aprobado-title-solicitud-credito'>
          <Link href='/products'>
            <i>
              <ArrowLeft href='/products' />
            </i>
          </Link>
          <h2>Estudio de crèdito</h2>
        </div>
        <ProgressBar currentStep={1} />
        <form className="form-grid" onSubmit={preAprobadoBtnHandler}>
          {/* Primera columna */}
          <div className="column">
            <div className="form-group">
              <label htmlFor="nombreApellido">Nombre y apellido</label>
              <input
                id="nombreApellido"
                name="nombreApellido"
                placeholder="Escriba su nombre y apellido"
                value={formData.nombreApellido}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ingresos">Ingresos</label>
              <input
                id="ingresos"
                name="ingresos"
                placeholder="$"
                value={formData.ingresos}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Número de teléfono</label>
              <input
                id="telefono"
                name="telefono"
                placeholder="Escriba su número de teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Segunda columna */}
          <div className="column" id="pre-aprobado-col-2">
            <div className="form-group">
              <label htmlFor="cedula">Número de cédula</label>
              <input
                id="cedula"
                name="cedula"
                placeholder="Escriba su número de cédula"
                value={formData.cedula}
                onChange={handleInputChange}
              />
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="cc"
                    checked={formData.tipoDocumento === 'CC'}
                    onChange={() => handleCheckboxChange('CC')}
                  />
                  <label htmlFor="cc">CC</label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="pasaporte"
                    checked={formData.tipoDocumento === 'Pasaporte'}
                    onChange={() => handleCheckboxChange('Pasaporte')}
                  />
                  <label htmlFor="pasaporte">Pasaporte</label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="egresos">Egresos</label>
              <input
                id="egresos"
                name="egresos"
                placeholder="$"
                value={formData.egresos}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group" id="email-input">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                name="email"
                placeholder="Escriba su correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Tercera columna */}
          <div className="column">
            <div className="form-group">
              <label htmlFor="fechaExpedicion">Fecha expedición</label>
              <input
                id="fechaExpedicion"
                type="date"
                name="fechaExpedicion"
                value={formData.fechaExpedicion}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cuotaInicial">Cuota inicial</label>
              <input
                id="cuotaInicial"
                name="cuotaInicial"
                placeholder="$"
                value={formData.cuotaInicial}
                onChange={handleInputChange}
              />
            </div>
            <div className="result-box">
              <div className="result-title">Pre-aprobado por:</div>
              <div id="pre-aprobado-resp">{response}</div>
            </div>
          </div>

          {/* Botón de submit */}
          <div className="form-group" id="pre-aprobado-btn">
            <button type="submit" id="button-preaprobado">
              Consultar pre-aprobado
            </button>
          </div>
        </form>

        <div className='opciones-disponibles'>
          <PopupSlider />
        </div>
      </div>
      <div className="continuar-credito">
        <button onClick={() => router.push('/forms/solicitud-credito')} className="button-continuar">Continuar con mi crédito</button>
      </div>
      {popUpOtpOpen && (
        <div className="popup-otp-preaprobado-form">
          {response ? (
            <div className="otp-response">
              <span>{response.toLowerCase()} </span>
              <CheckCircle size={80} color="#B4924E" />
            </div>
          ) : (
            <form className="popup-otp-preaprobado-content" onSubmit={otpSubmitHandler}>
              <h3>INGRESAR OTP</h3>
              <input
                id="otp"
                type="text"
                name="otp"
                onChange={handleInputChange}
                placeholder="Ingresar código"
              />
              <button className="button" type="submit">
                COMPROBAR CÓDIGO
              </button>
            </form>
          )}
          <div className="popup-otp-preaprobado-closeBtn">
            <button onClick={handleCloseBtn} className="button">
              CERRAR
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PreaprobadoForm;
