import Link from "next/link";
import "./index.css";
import { MoveRight } from "lucide-react";
import Image from 'next/image';


interface Product {
    id: number
    timestamp: string;
    modelo: string;
    marcaTipo: string;
    color: string;
    precio: number;
    imagen: string;
}


const ProductCard = ({ product }: { product: Product }) => {
    

    // Función para obtener la URL de la imagen deforma segura
    const getImageUrl = (imageString: string | string[] | undefined): string => {
        if (!imageString) return '/placeholder-image.jpg';
        
        const image = Array.isArray(imageString) ? imageString[0] : imageString;
       
        
        try {
            // Verifica si es una URL de Google Drive
            if (image?.includes('google') && image?.includes('id=')) {
                const idPart = image.split('id=')[1];
                return idPart ? `https://lh3.googleusercontent.com/d/${idPart}=s200` : '/placeholder-image.jpg';
            }
            
            // Si es una URL regular, la devuelve directamente
            return image;
        } catch (error) {
            console.error('Error processing image URL:', error);
            return '/placeholder-image.jpg';
        }
    };

    function formatNumber(number: number): string {
        return number.toLocaleString('en-US');
    }

    const priceFormated = formatNumber(product.precio);

    return (
        <div className="product-card">
            <Link href={`/products/${product.id}`}>
            <div className="product-card_image">
                <Image 
                    src={getImageUrl(product.imagen)}
                    alt={product.modelo} 
                    width={200} 
                    height={200} 
                />
            </div>


            <div className="product-card__info">
                <div>
                    <div className="color-list">
                        <span style={{ backgroundColor: 'rgb(54, 55, 56)', borderRadius: '50%', display: 'inline-block', width: '15px', height: '15px' }}></span>
                        <span style={{ backgroundColor: 'rgb(63, 82, 193)', borderRadius: '50%', display: 'inline-block', width: '15px', height: '15px' }}></span>
                        <span style={{ backgroundColor: 'rgb(199, 133, 41)', borderRadius: '50%', display: 'inline-block', width: '15px', height: '15px' }}></span>
                    </div>
                    <div className="info-card">
                        <span id="info-card-model">{product.modelo}</span>
                        <span id="info-card-marcaTipo">{product.marcaTipo}</span>
                    </div>
                </div>

                <div className="info-price">
                    <h3>{`$${priceFormated}`}</h3>
                    <span>{/*Con papeles*/}</span>
                </div>
            </div>
            <div className="btn-r-arrow">
             
                    <span>Ver más</span>
                    <MoveRight />
             
            </div>
            </Link>
        </div>
    );
}

export default ProductCard;