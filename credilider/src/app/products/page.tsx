'use client'
import { useQuery } from '@tanstack/react-query';
import ProductCard from "@/components/ProductCard/Index";
import axios from 'axios';
import './index.css';
import { SearchIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCardSkeleton from '@/components/ProductCard/Skeleton';
import { FilterRow } from '@/components/FilterRow/Index';
import { Head } from '@/components/Head/Index';
import { roboto, robotoCondensed } from '../fonts/fonts';



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
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortedMotos, setSortedMotos] = useState<Moto[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropFilterHandler = () => {
    setIsDropdownOpen(!isDropdownOpen); // Cambia el estado del dropdown
  };

  const { data: motos, isLoading, error } = useQuery({
    queryKey: ['motos'],
    queryFn: fetchMotos,
  });

  useEffect(() => {
    if (motos) {
      let filteredMotos = motos;

      // Filtrar por búsqueda
      if (searchTerm) {
        filteredMotos = filteredMotos.filter((moto) =>
          moto.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          moto.marcaTipo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Ordenar motos basado en el criterio de sortOrder
      let sortedData = [...filteredMotos];
      if (sortOrder === 'price-asc') {
        sortedData = sortedData.sort((a, b) => a.precio - b.precio);
      } else if (sortOrder === 'price-desc') {
        sortedData = sortedData.sort((a, b) => b.precio - a.precio);
      }

      setSortedMotos(sortedData);
    }
  }, [motos, sortOrder, searchTerm]);

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  // Manejar cambio en el criterio de orden
  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div  className={`${robotoCondensed.className}`}>
      {/* Pasando props al componente FilterRow */}
      <FilterRow
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={dropFilterHandler}
      />
      <div className='products-grid'>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
          : sortedMotos.map((moto: Moto) => (
            <ProductCard key={moto.id} product={moto} />
          ))}
      </div>
    </div>
  );
};

export default Products;

