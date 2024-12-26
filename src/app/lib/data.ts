import axios from "axios";

export async function fetchMotos() {
    try {
      // Artificially delay a response for demo purposes.
      // Don't do this in production :)
  
      /*  console.log('Fetching revenue data...');
        await new Promise((resolve) => setTimeout(resolve, 3000)); */

        
      console.log("Fetching revenue data...");
  
      const response = await axios.get(
        `https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=listMotos`
      );
      return response.data;
      // console.log('Data fetch completed after 3 seconds.');
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch revenue data.");
    }
  }

  export async function fectchMotoById(id: string) {
    try {
      // Artificially delay a response for demo purposes.
      // Don't do this in production :)
  
      /* console.log('Fetching revenue data...');
        await new Promise((resolve) => setTimeout(resolve, 3000)); */
        
  
      const response = await axios.get(
        `https://script.google.com/macros/s/AKfycbzeeeIGY1GEUQR_3zRKbd_75E5lE4XvY3Y-7Ht7_vuMF0cyLBgNGWbTI_pd72OJ4hWf5g/exec?action=getMotoById&id=${id}`
      );
      const data = response.data;
      //const moto = data.find((moto: { id: string }) => moto.id === id);
  
      return data;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch revenue data.");
    }
  }