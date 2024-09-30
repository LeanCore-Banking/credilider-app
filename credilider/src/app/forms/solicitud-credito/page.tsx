'use client'
import ProgressBar from '@/components/ProgressBar/Index';
import useFormStore from '@/store/UseFormStore';
import axios from 'axios';


const SolicitudCreditoForm = () => {
  const { formData, setFormData } = useFormStore() as { formData: any, setFormData: (data: any) => void };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/solicitud-credito', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Aquí puedes manejar la respuesta del backend
      alert('Solicitud enviada correctamente');
    } catch (error) {
      // Manejo de errores
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  const handleChange = (e:any) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
<ProgressBar currentStep={2} />
        <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion || ''}
            onChange={handleChange}
          />
        </div>
        {/* Otros campos adicionales */}
        <button type="submit">Enviar Solicitud</button>
      </form>
    </div>
  );
};

export default SolicitudCreditoForm;
