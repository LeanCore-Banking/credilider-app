import Link from "next/link";
import "./index.css";
import { MoveRight } from "lucide-react";


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

    //console.log(`https://lh3.googleusercontent.com/d/${product.imagen.split('id=')[1]}=s100`);
    const firstImage = product.imagen && Array.isArray(product.imagen) ? product.imagen[0] : '';

    const arrayColores = product.color.split(",").map(color => color.trim());
    console.log('arrayColores:', arrayColores);

    function formatNumber(number: number): string {
        return number.toLocaleString('en-US');
      }

      const priceFormated = formatNumber(product.precio);
      


    return (
        <div className="product-card">
            <div className="product-card_image">
            <img src={`https://lh3.googleusercontent.com/d/${firstImage.split('id=')[1]}=s200`} alt={product.modelo} />
            </div>
            <div className="product-card__info">
                <div className="color-list">
                    <span style={{ backgroundColor: 'rgb(54, 55, 56)', borderRadius: '50%', display: 'inline-block', width: '15px', height: '15px' }}></span>
                    <span style={{ backgroundColor: 'rgb(63, 82, 193)', borderRadius: '50%', display: 'inline-block', width: '15px', height: '15px' }}></span>
                    <span style={{ backgroundColor: 'rgb(199, 133, 41)', borderRadius: '50%', display: 'inline-block', width: '15px', height: '15px' }}></span>
                </div>
                <div className="info-card">
                    <span id="info-card-model">{product.modelo}</span>
                    <span id="info-card-marcaTipo">{product.marcaTipo}</span>
                </div>
                <div className="info-price">
                    <h3>{`$${priceFormated}`}</h3>
                    <span>Con papeles</span>
                </div>
            </div>
            <div className="btn-r-arrow">
                <Link href={`/products/${product.id}`}>
                    <span>Ver más</span>
                    <MoveRight />
                </Link>
            </div>
        </div>
    );
}

export default ProductCard;