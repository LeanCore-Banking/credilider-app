'use client'
import useFormStore from '@/store/UseFormStore';
import { useRouter } from 'next/navigation';
import './styles.css';
import { useState } from 'react';
import ProgressBar from '@/components/ProgressBar/Index';

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
      setTimeout(() => resolve(`Pre-aprobado por $${Math.floor(Math.random() * 100000)}`), 1000)
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
    <div>
      <ProgressBar currentStep={1} />
      <form className="form-grid">
        {/* Primera columna */}
        <div className="column">
          <div className="form-group">
            <label htmlFor="nombreApellido">Nombre y apellido</label>
            <input
              id="nombreApellido"
              name="nombreApellido"
              value={formData.nombreApellido}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ingresos">Ingresos</label>
            <input
              id="ingresos"
              name="ingresos"
              type="number"
              value={formData.ingresos}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Número de teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Segunda columna */}
        <div className="column">
          <div className="form-group">
            <label htmlFor="cedula">Número de cédula</label>
            <input
              id="cedula"
              name="cedula"
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
              type="number"
              value={formData.egresos}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <button onClick={consultarPreAprobado} type="button" className="button">
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
              type="date"
              value={formData.fechaExpedicion}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cuotaInicial">Cuota inicial</label>
            <input
              id="cuotaInicial"
              name="cuotaInicial"
              type="number"
              value={formData.cuotaInicial}
              onChange={handleInputChange}
            />
          </div>
          <div className="result-box">
            <p className="result-title">Resultado de la consulta:</p>
            <p>{response}</p>
          </div>
        </div>
      </form>
      <div className="continuar-credito">
        <button onClick={() => router.push('/forms/solicitud-credito')} className="button">Continuar con la solicitud de crédito</button>
      </div>
      {popUpOtmOpen && (
        <div className="pop-up">
          <div className="pop-up-content">
            <p>{responseOtm}</p>
            <button onClick={() => setPopUpOtm(false)} className="button">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreaprobadoForm;
