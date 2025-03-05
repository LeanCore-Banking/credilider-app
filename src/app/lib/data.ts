import axios from "axios";

export async function fetchMotos() {
    try {
      // Artificially delay a response for demo purposes.
      // Don't do this in production :)
  
      /*  console.log('Fetching revenue data...');
        await new Promise((resolve) => setTimeout(resolve, 3000)); */

        
      //console.log("Fetching revenue motos data...");
  
      const response = await axios.get(
        `https://script.google.com/macros/s/AKfycbyws0UuN9ucX-RZBctKVgda8Ah5T_7Lidcd1m6AXzW_8wIHScfmkJiVCIkfgLJ7BOkMwA/exec?action=listMotos`
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

        console.log("Fetching revenue moto data...");
  
      const response = await axios.get(
        `https://script.google.com/macros/s/AKfycbyws0UuN9ucX-RZBctKVgda8Ah5T_7Lidcd1m6AXzW_8wIHScfmkJiVCIkfgLJ7BOkMwA/exec?action=getMotoById&id=${id}`
      );
      const data = response.data;
      //const moto = data.find((moto: { id: string }) => moto.id === id);
  
      return data;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch revenue data.");
    }
  }