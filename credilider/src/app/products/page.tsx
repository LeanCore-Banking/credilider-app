'use client'
import { useQuery } from '@tanstack/react-query';
import ProductCard from "@/components/ProductCard/Index";
import axios from 'axios';
import './index.css';
import { SearchIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';



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
  const [sortOrder, setSortOrder] = useState<string>(''); // Estado para almacenar el criterio de orden
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para almacenar el término de búsqueda
  const [sortedMotos, setSortedMotos] = useState<Moto[]>([]); // Estado para las motos ordenadas
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropFilterHandler = () => {
    setIsDropdownOpen(!isDropdownOpen); // Cambia el estado del dropdown
  };

  const { data: motos, isLoading, error } = useQuery({
    queryKey: ['motos'],
    queryFn: fetchMotos,
  });

  // Evitar actualizaciones infinitas con useEffect solo cuando motos cambia
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

  if (isLoading) return <div>Cargando...</div>;
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
    <div>
      <header className='header-row'>
        <div className="img-container">
          <img src="" alt="logo-credilider" />
        </div>
        <div className="row1">

        </div>
        <div className="row2">

        </div>
      </header>

      <div className="filter-row">
        <div className="filter-inputs">
          {/* Dropdown para ordenar por precio */}
          <div className="dropdown-wrapper">
            <div className="drop-content">
              <div id="dropdownBtnSort" onClick={dropFilterHandler}>Sort By  {isDropdownOpen ? <ChevronUp /> : <ChevronDown />} </div>
              <div className={`dropdown ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                <div id="dropdownSortOptions" className="dropdownSortOptions">
                  <a className="sortOption" onClick={() => handleSortChange('price-asc')}>Menor precio</a>
                  <a className="sortOption" onClick={() => handleSortChange('price-desc')}>Mayor precio</a>
                </div>
              </div>
            </div>
          </div>

          <div className="search-wrapper">
            <div className="search-content">
              <SearchIcon className="search-icon" />

              <input
                type="text"
                placeholder="Buscar producto"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className='credit-button-container'>
          <button className="credit-button">PEDIR CRÉDITO YA</button>
        </div>
      </div>

      <div className='products-grid'>
        {sortedMotos.map((moto: Moto) => (
          <ProductCard key={moto.id} product={moto} />
        ))}
      </div>
    </div>
  );
};

export default Products;
