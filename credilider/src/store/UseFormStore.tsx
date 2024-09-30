import {create} from 'zustand';

const useFormStore = create((set) => ({
  formData: {
    nombre: '',
    apellido: '',
    // Otros campos del formulario
  },
  setFormData: (data:any) => set((state:any) => ({
    formData: { ...state.formData, ...data },
  })),
}));

export default useFormStore;

