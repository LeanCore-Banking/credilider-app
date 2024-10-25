import {create} from 'zustand';

const useFormStore = create((set) => ({
  formData: {
    nombre: '',
    nit: '',
    phone: '',
    email: '',
    // Otros campos del formulario
  },
  setFormData: (data:any) => set((state:any) => ({
    formData: { ...state.formData, ...data },
  })),
}));



export default useFormStore;

