import {create} from 'zustand';
import axios from 'axios';

const useMotoStore = create((set) => ({
  motos: [],
  loading: false,
  error: null,
  fetchMotos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=listMotos`);
      console.log('response:',response.data);
      set({ motos: response.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useMotoStore;
