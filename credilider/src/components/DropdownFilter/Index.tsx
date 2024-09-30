import React, { useState, useEffect } from 'react';

// Datos iniciales de ejemplo
const initialData = [
  { name: 'John', rightHanded: true, age: 21 },
  { name: 'Dave', rightHanded: true, age: 47 },
  { name: 'Gina', rightHanded: false, age: 28 },
  { name: 'George', rightHanded: false, age: 16 },
  { name: 'Lucy', rightHanded: true, age: 34 }
];

// Definición del tipo para el objeto del producto
type Person = {
  name: string;
  rightHanded: boolean;
  age: number;
};

const DropdownComponent: React.FC = () => {
  const [data, setData] = useState<Person[]>(initialData);
  const [sortType, setSortType] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [displayedData, setDisplayedData] = useState<Person[]>(initialData);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  useEffect(() => {
    filterAndSortData();
  }, [sortType, filterType]);

  const filterAndSortData = () => {
    let filteredData = [...data];

    // Aplicar filtro
    if (filterType === 'Right Handed') {
      filteredData = filteredData.filter((person) => person.rightHanded);
    } else if (filterType === 'Left Handed') {
      filteredData = filteredData.filter((person) => !person.rightHanded);
    }

    // Aplicar orden
    if (sortType === 'Name A - Z') {
      filteredData.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (sortType === 'Name Z - A') {
      filteredData.sort((a, b) => (a.name < b.name ? 1 : -1));
    } else if (sortType === 'Age ASC') {
      filteredData.sort((a, b) => a.age - b.age);
    } else if (sortType === 'Age DESC') {
      filteredData.sort((a, b) => b.age - a.age);
    }

    setDisplayedData(filteredData);
  };

  const resetFilters = () => {
    setSortType('');
    setFilterType('');
    setDisplayedData(initialData);
  };

  return (
    <div className="wrapper">
      {/* Sort Dropdown */}
      <div className="dropdown">
        <button
          onClick={() => setSortDropdownVisible(!sortDropdownVisible)}
        >
          Sort By <i className="fa-solid fa-chevron-down"></i>
        </button>
        {sortDropdownVisible && (
          <div className="dropdownSortOptions">
            <a href="#" className="sortOption" onClick={() => setSortType('Name A - Z')}>Name <span>A - Z</span></a>
            <a href="#" className="sortOption" onClick={() => setSortType('Name Z - A')}>Name <span>Z - A</span></a>
            <a href="#" className="sortOption" onClick={() => setSortType('Age ASC')}>Age <span>ASC</span></a>
            <a href="#" className="sortOption" onClick={() => setSortType('Age DESC')}>Age <span>DESC</span></a>
          </div>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="dropdown">
        <button
          onClick={() => setFilterDropdownVisible(!filterDropdownVisible)}
        >
          Filter <i className="fa-solid fa-chevron-down"></i>
        </button>
        {filterDropdownVisible && (
          <div className="dropdownFilterOptions">
            <a href="#" className="filterOption" onClick={() => setFilterType('Right Handed')}>Right Handed</a>
            <a href="#" className="filterOption" onClick={() => setFilterType('Left Handed')}>Left Handed</a>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button id="clearBtn" onClick={resetFilters}>
        Reset
      </button>

      {/* Render List */}
      <div id="list">
        {displayedData.map((person, index) => (
          <div key={index}>
            <h2>{person.name}</h2>
            <p>{person.rightHanded ? 'Right Handed' : 'Left Handed'}</p>
            <p>{person.age} years old</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownComponent;
