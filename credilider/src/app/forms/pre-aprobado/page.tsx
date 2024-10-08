'use client'
import useFormStore from '@/store/UseFormStore';
import { useRouter } from 'next/navigation';
import './styles.css';
import '../solicitud-credito/index.css';
import { useState } from 'react';
import ProgressBar from '@/components/ProgressBar/Index';
import { robotoCondensed } from '@/app/fonts/fonts';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  nombre: string;
  apellido: string;
  [key: string]: string;
}
const PreaprobadoForm = () => {
  const [popUpOtmOpen, setPopUpOtm] = useState(false);
  const [responseOtm, setOtmResponse] = useState('');
  const [response, setResponse] = useState('');
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombreApellido: '',
    ingresos: '',
    telefono: '',
    cedula: '',
    tipoDocumento: 'CC',
    egresos: '',
    fechaExpedicion: '',
    cuotaInicial: '',
  });

  const consultarPreAprobado = async () => {
    setPopUpOtm(true);
    // Simulación de una llamada a un endpoint
    const response = await new Promise(resolve =>
      setTimeout(() => resolve(`$${Math.floor(Math.random() * 100000)}`), 1000)
    )
    setOtmResponse(response as string);
    setResponse(response as string);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({ ...prev, tipoDocumento: value }));
  };

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
        <form className="form-grid">
          {/* Primera columna */}
          <div className="column">
            <div className="form-group">
              <label htmlFor="nombreApellido">Nombre y apellido</label>
              <input
                id="nombreApellido"
                name="nombreApellido"
                placeholder='Escriba su nombre y apellido'
                value={formData.nombreApellido}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ingresos">Ingresos</label>
              <input
                id="ingresos"
                name="ingresos"
                placeholder='$'
                value={formData.ingresos}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Número de teléfono</label>
              <input
                id="telefono"
                name="telefono"
                placeholder='Escriba su número de teléfono'
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Segunda columna */}
          <div className="column" id='pre-aprobado-col-2'>
            <div className="form-group">
              <label htmlFor="cedula">Número de cédula</label>
              <input
                id="cedula"
                name="cedula"
                placeholder='Escriba su número de cédula'
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
                placeholder='$'
                value={formData.egresos}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group" id='pre-aprobado-btn'>
              <button onClick={consultarPreAprobado} type="button" className="button-preaprobado">
                Consultar pre-aprobado
              </button>
            </div>
          </div>

          {/* Tercera columna */}
          <div className="column">
            <div className="form-group">
              <label htmlFor="fechaExpedicion">Fecha expedición</label>
              <input
                id="fechaExpedicion"
                name="fechaExpedicion"
                placeholder='Escriba la fecha de expedición'
                value={formData.fechaExpedicion}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cuotaInicial">Cuota inicial</label>
              <input
                id="cuotaInicial"
                name="cuotaInicial"
                placeholder='$'
                value={formData.cuotaInicial}
                onChange={handleInputChange}
              />
            </div>
            <div className="result-box">
              <div className="result-title">Pre-aprobado por:

              </div>
              <div id='pre-aprobado-resp'>{response}</div>
            </div>
          </div>
        </form>
      </div>
      <div className="continuar-credito">
        <button onClick={() => router.push('/forms/solicitud-credito')} className="button-continuar">Continuar con mi crédito</button>
      </div>
      {popUpOtmOpen && (
        <div className="popup-otp-preaprobado-form">
          <div className="popup-otp-preaprobado-content">
            <h3>INGRESAR OTP</h3>
            <input
              id='input-otp'
              type="text"
              name='otp'
              placeholder='Ingresar codigo' />
            <button className="button">COPROBAR CÒDIGO</button>
          </div>
          <div className='popup-otp-preaprobado-closeBtn'>
            <button onClick={() => setPopUpOtm(false)} className="button">CERRAR</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreaprobadoForm;
