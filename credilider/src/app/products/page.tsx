'use client'

import { useQuery } from '@tanstack/react-query';
import ProductCard from "@/components/ProductCard/Index";
import axios from 'axios';
import './index.css';

interface Moto {
  id: number;
  timestamp: string;
  modelo: string;
  marcaTipo: string;
  color: string;
  precio: number;
  imagen: string;
}

const fetchMotos = async (): Promise<Moto[]> => {
  const response = await axios.get(
    `https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=listMotos`
  );
  return response.data;
};

const Products: React.FC = () => {
  
  const { data: motos, isLoading, error } = useQuery({ queryKey: ['motos'], queryFn: fetchMotos });

  if (isLoading) return <div>Cargando...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Lista de Motos</h1>
      <div className='products-grid'>
        {motos?.map((moto: Moto) => (
          <ProductCard key={moto.id} product={moto} />
        ))}
      </div>
    </div>
  );
};

export default Products;
