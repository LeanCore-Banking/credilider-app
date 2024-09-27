'use client';

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Product = {
    id: number;
    timestamp: string;
    modelo: string;
    marcaTipo: string;
    color: string;
    precio: number;
    imagen: string;
};

const fetchProduct = async (id: string): Promise<Product> => {
    const response = await axios.get(`https://script.google.com/macros/s/AKfycbwKqKdyD5GVNlOqYnFEAjUOlzCKODEOyyFosrPkZxeGyA7MF-GRofUmE7kN8r7lIaZuZA/exec?action=getMotoById&id=${id}`);
    return response.data;
};

export const useProduct = (id: string) => {
    return useQuery<Product, Error>({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(id),
    });
};


