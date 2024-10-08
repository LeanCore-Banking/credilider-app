'use client'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import styles from './FilterRow.module.css'
import Link from 'next/link';

interface FilterRowProps {
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSortChange: (order: string) => void;
    isDropdownOpen: boolean;
    toggleDropdown: () => void;
  }

export const FilterRow: React.FC<FilterRowProps> = ({ 
        searchTerm, 
        onSearchChange, 
        onSortChange, 
        isDropdownOpen, 
        toggleDropdown 
      }
) =>{
    return (
        <div className={styles.filterRow}>
            <div className={styles.filterInputs}>
                <div className={styles.dropdownWrapper}>
                    <div className={styles.dropContent}>
                        <div className={styles.dropdownBtnSort} onClick={toggleDropdown}>
                            Filtrar por {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        <div className={`${styles.dropdown} ${isDropdownOpen ? styles.dropdownOpen : ''}`}>
                            <div className={styles.dropdownSortOptions}>
                                <div className={styles.sortOption} onClick={() => onSortChange('price-asc')}>Menor precio</div>
                                <div className={styles.sortOption} onClick={() => onSortChange('price-desc')}>Mayor precio</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.searchWrapper}>
                    <div className={styles.searchContent}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Buscar producto"
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={onSearchChange}
                        />
                    </div>
                </div>
            </div>
           
            <div className={styles.creditButtonContainer}>
            <Link href="/forms/pre-aprobado">
                <button className={styles.creditButton}>PEDIR CRÉDITO YA</button>
            </Link>
            </div>
        </div>
    )
  
}