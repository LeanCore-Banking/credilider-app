'use client'
import ProgressBar from '@/components/ProgressBar/Index';
import useFormStore from '@/store/UseFormStore';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './index.css';
import { robotoCondensed } from '@/app/fonts/fonts';
import { useEffect } from 'react';
import { formatNumber } from '@/utils/format';

const SolicitudCreditoForm = () => {
  const { formData, setFormData } = useFormStore() as { formData: any, setFormData: (data: any) => void };

  useEffect(() => {
    // Recuperar datos del localStorage
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Asegurarse de que todos los campos numéricos se formateen correctamente
        const formattedData = {
          ...parsedData,
          incomes: parsedData.incomes || '',
          expenses: parsedData.expenses || '',
          cuota_inicial: parsedData.cuota_inicial || '',
          deudas_actuales: parsedData.deudas_actuales || '',
          deudas_transito: parsedData.deudas_transito || '',
          valor_financiar: parsedData.valor_financiar || '',
        };
        setFormData(formattedData);
        console.log('Datos recuperados del localStorage:', formattedData);
      } catch (error) {
        console.error('Error al parsear datos del localStorage:', error);
      }
    }
  }, [setFormData]);

  // Función para simular delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Función para simular validación
  const validarDatos = (data: any) => {
    if (!data.nombreApellido || !data.cedula) {
      throw new Error('Datos incompletos');
    }
    return Math.random() > 0.3; // 70% de probabilidad de éxito
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Simulamos tiempo de respuesta del servidor (1.5 segundos)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Datos enviados:', formData);
      alert('Solicitud enviada correctamente');
      
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    // Lista de campos que necesitan formato numérico
    const numericFields = ['incomes', 'expenses', 'cuota_inicial', 'deudas_actuales', 'deudas_transito', 'valor_financiar'];
    
    if (numericFields.includes(name)) {
      const rawValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: rawValue
      });
      
      e.target.value = formatNumber(value);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className={robotoCondensed.className}>
      <div className='pre-aprobado-title-solicitud-credito'>
        <Link href='/forms/pre-aprobado'>
          <i>
            <ArrowLeft href='/forms/pre-aprobado' />
          </i>
        </Link>
        <h2>Estudio de crédito</h2>
      </div>
      <div id='solicitud-progress-bar-content'>

        <ProgressBar currentStep={2} />
      </div>
      <div className="form-container-solicitud-credito">
        <form onSubmit={handleSubmit}>
          <div className="form-row-solicitud-credito">
            <div className="form-group-solicitud-credito">
              <label htmlFor="nombreApellido">Nombre y apellido</label>
              <input
                id="nombreApellido"
                type="text"
                name="nombreApellido"
                value={formData.nombreApellido || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="tipoDocumento">Tipo de documento</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento || 'CC'}
                onChange={handleChange}
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="cedula">Número de documento</label>
              <input
                id="cedula"
                type="text"
                name="cedula"
                value={formData.cedula || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="fechaExpedicion">Fecha expedición documento</label>
              <input
                id="fechaExpedicion"
                type="date"
                name="fechaExpedicion"
                value={formData.fechaExpedicion || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-solicitud-credito">
            <div className="form-group-solicitud-credito">
              <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input
                id="fecha_nacimiento"
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="telefono">Número de teléfono</label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="contrato_laboral">Tipo de Contrato Laboral</label>
              <select
                id="contrato_laboral"
                name="contrato_laboral"
                value={formData.contrato_laboral || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Contrato indefinido">Contrato indefinido</option>
                <option value="Contrato término fijo / obra o labor">Contrato término fijo / obra o labor</option>
                <option value="Independiente con RUT">Independiente con RUT</option>
                <option value="Informal">Informal</option>
              </select>
            </div>
          </div>

          <div className="form-row-solicitud-credito">
            <div className="form-group-solicitud-credito">
              <label htmlFor="antigüedad_empresa">Antigüedad en la Empresa</label>
              <select
                id="antigüedad_empresa"
                name="antigüedad_empresa"
                value={formData.antigüedad_empresa || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Más de 24 meses">Más de 24 meses</option>
                <option value="Entre 12 y 24 meses">Entre 12 y 24 meses</option>
                <option value="Entre 6 y 12 meses">Entre 6 y 12 meses</option>
                <option value="Menos de 6 meses">Menos de 6 meses</option>
                <option value="sin_antiguedad">Sin antigüedad</option>
              </select>
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="number-dependants">Número de Dependientes</label>
              <input
                id="number-dependants"
                type="number"
                name="number-dependants"
                value={formData['number-dependants'] || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="incomes">Ingresos mensuales</label>
              <input
                id="incomes"
                type="text"
                name="incomes"
                placeholder="$"
                value={formData.incomes ? formatNumber(formData.incomes) : ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="expenses">Gastos mensuales</label>
              <input
                id="expenses"
                type="text"
                name="expenses"
                placeholder="$"
                value={formData.expenses ? formatNumber(formData.expenses) : ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-solicitud-credito">
            <div className="form-group-solicitud-credito">
              <label htmlFor="deudas_actuales">Deudas mensuales</label>
              <input
                id="deudas_actuales"
                type="text"
                name="deudas_actuales"
                placeholder="$"
                value={formData.deudas_actuales ? formatNumber(formData.deudas_actuales) : ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="deudas_transito">Comparendos de tránsito pendientes</label>
              <input
                id="deudas_transito"
                type="text"
                name="deudas_transito"
                placeholder="$"
                value={formData.deudas_transito ? formatNumber(formData.deudas_transito) : ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="cuotas">Número de cuotas</label>
              <input
                id="cuotas"
                name="cuotas"
                type="number"
                min="1"
                max="84"
                value={formData.cuotas || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="valor_financiar">Valor a financiar</label>
              <input
                id="valor_financiar"
                type="text"
                name="valor_financiar"
                placeholder="$"
                value={formData.valor_financiar ? formatNumber(formData.valor_financiar) : ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="submit-container-solicitud-credito">
            <button type="submit">Finalizar solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudCreditoForm;
