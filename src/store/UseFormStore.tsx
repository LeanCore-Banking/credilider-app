import {create} from 'zustand';

const useFormStore = create((set) => ({
  formData: {
    nombreApellido: '',
    cedula: '',
    telefono: '',
    email: '',
    incomes: '',
    expenses: '',
    fechaExpedicion: '',
    cuota_inicial: '',
    tipoDocumento: 'CC',
    // Nuevos campos
    direccion: '',
    fecha_nacimiento: '',
    nivel_academico: '',
    personas_cargo: '',
    num_hijos: '',
    tipo_contrato: '',
    empresa_actual: '',
    fecha_vinculacion: '',
    correo: '',
  },
  setFormData: (data:any) => set((state:any) => ({
    formData: { ...state.formData, ...data },
  })),
}));

export default useFormStore;

