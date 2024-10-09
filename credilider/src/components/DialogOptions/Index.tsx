import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './styles.css';
import ProductCard from '../ProductCard/Index';
import { fetchMotos } from '@/app/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QuotesCardSkeleton } from '../skeletons';

const PopupSlider: React.FC = () => {
    const [productList, setProductList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar el loading
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchMotos(); // Llama a tu función para obtener productos
                setProductList(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % productList.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + productList.length) % productList.length);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <span className='openDialogOptions'>Ver opciones disponibles</span>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <div className="slider-container">
                        <button className="slider-button" onClick={prevImage}>
                            <ChevronLeft />
                        </button>

                        <div className="slider-content">
                            {isLoading ? (
                                <>
                                    <QuotesCardSkeleton />
                                </>
                            ) : (
                                // Render the actual products when loaded
                                productList.slice(currentImage, currentImage + 3).map((product, index) => (
                                    <div key={index} className="slider-block">
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            )}

                        </div>

                        <button className="slider-button" onClick={nextImage}>
                            <ChevronRight />
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default PopupSlider;
