export const formatNumber = (value: string): string => {
    // Primero eliminar cualquier carácter que no sea número
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Si no hay números, retornar cadena vacía
    if (!numericValue) return '';
    
    // Convertir a número
    const number = parseInt(numericValue, 10);
    if (isNaN(number)) return '';
    
    // Convertir a string y agregar comas y símbolo $
    return `$${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}; 