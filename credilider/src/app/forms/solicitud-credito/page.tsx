'use client'
import ProgressBar from '@/components/ProgressBar/Index';
import useFormStore from '@/store/UseFormStore';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './index.css';
import { robotoCondensed } from '@/app/fonts/fonts';

const SolicitudCreditoForm = () => {
  const { formData, setFormData } = useFormStore() as { formData: any, setFormData: (data: any) => void };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/solicitud-credito', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Solicitud enviada correctamente');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ [e.target.name]: e.target.value });
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
              <label htmlFor="nombre">Nombre y apellido</label>
              <input type="text" id="nombre" name="nombre" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="cedula">Número de cédula</label>
              <input type="text" id="cedula" name="cedula" required onChange={handleChange} />
              <div className="checkbox-group-solicitud-credito">
                <input type="checkbox" id="cc" name="tipo_documento" value="cc" onChange={handleChange} />
                <label htmlFor="cc">CC</label>
                <input type="checkbox" id="pasaporte" name="tipo_documento" value="pasaporte" onChange={handleChange} />
                <label htmlFor="pasaporte">Pasaporte</label>
              </div>
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="fecha_expedicion">Fecha de expedición</label>
              <input type="date" id="fecha_expedicion" name="fecha_expedicion" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="ingresos">Ingresos</label>
              <input type="number" id="ingresos" name="ingresos" required onChange={handleChange} />
            </div>
          </div>
          <div className="form-row-solicitud-credito">
            <div className="form-group-solicitud-credito">
              <label htmlFor="egresos">Egresos</label>
              <input type="number" id="egresos" name="egresos" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="cuota_inicial">Cuota inicial</label>
              <input type="number" id="cuota_inicial" name="cuota_inicial" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="correo">Correo electrónico</label>
              <input type="email" id="correo" name="correo" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="direccion">Dirección de residencia</label>
              <input type="text" id="direccion" name="direccion" required onChange={handleChange} />
            </div>
          </div>
          <div className="form-row-solicitud-credito">
            <div className="form-group-solicitud-credito">
              <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="nivel_academico">Nivel académico</label>
              <select id="nivel_academico" name="nivel_academico" required onChange={handleChange}>
                <option value="">Seleccione una opción</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="tecnico">Técnico</option>
                <option value="universitario">Universitario</option>
                <option value="postgrado">Postgrado</option>
              </select>
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="personas_cargo">Número de personas a cargo</label>
              <input type="number" id="personas_cargo" name="personas_cargo" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="num_hijos">Número de hijos</label>
              <input type="number" id="num_hijos" name="num_hijos" required onChange={handleChange} />
            </div>
          </div>
          <div className="form-row-solicitud-credito">
            <div className="form-group-solicitud-credito">
              <label htmlFor="tipo_contrato">Tipo de contrato</label>
              <select id="tipo_contrato" name="tipo_contrato" required onChange={handleChange}>
                <option value="">Seleccione una opción</option>
                <option value="indefinido">Indefinido</option>
                <option value="fijo">Fijo</option>
                <option value="prestacion_servicios">Prestación de servicios</option>
                <option value="obra_labor">Obra o labor</option>
              </select>
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="empresa_actual">Empresa actual</label>
              <input type="text" id="empresa_actual" name="empresa_actual" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              <label htmlFor="fecha_vinculacion">Fecha de vinculación</label>
              <input type="date" id="fecha_vinculacion" name="fecha_vinculacion" required onChange={handleChange} />
            </div>
            <div className="form-group-solicitud-credito">
              {/* Empty column to maintain 4 columns */}
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
