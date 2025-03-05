'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProductCard from "@/components/ProductCard/Index";
import './index.css';
import { useState, useEffect } from 'react';
import ProductCardSkeleton from '@/components/ProductCard/Skeleton';
import { FilterRow } from '@/components/FilterRow/Index';
import { robotoCondensed } from '../fonts/fonts';
import { fetchMotos } from '../lib/data';

interface Moto {
  id: number;
  timestamp: string;
  modelo: string;
  marcaTipo: string;
  color: string;
  precio: number;
  imagen: string;
}

const Products: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortedMotos, setSortedMotos] = useState<Moto[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const dropFilterHandler = () => {
    setIsDropdownOpen(!isDropdownOpen); // Cambia el estado del dropdown
  };

  const { data: motos, isLoading, error, isFetching } = useQuery({
    queryKey: ['motos'],
    queryFn: fetchMotos,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 días
    gcTime: 31 * 24 * 60 * 60 * 1000, // 31 días
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000, // Refresca cada 5 minutos
  });

  /* useEffect(() => {
    if (motos) {
      console.log('Datos obtenidos:', motos);
      console.log('Usando caché:', !isFetching && !isLoading);
    }
  }, [motos, isFetching]); */

  useEffect(() => {
    if (motos) {
      let filteredMotos = motos;

      // Filtrar por búsqueda
      if (searchTerm) {
        filteredMotos = filteredMotos.filter((moto:any) =>
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

  if (error instanceof Error) {
    console.error('Error en la consulta:', error);
    return <div>Error: {error.message}</div>;
  }

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

