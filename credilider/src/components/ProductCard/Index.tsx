import Link from "next/link";


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
    console.log(`https://lh3.googleusercontent.com/d/${product.imagen.split('id=')[1]}=s100`);
    return (
        <div className="product-card">
            <div className="product-card__image">
            <img src={`DESACTIVE-https://lh3.googleusercontent.com/d/${product.imagen.split('id=')[1]}=s200`} alt={product.modelo} />
            </div>
            <div className="product-card__info">
                <div className="color-list">
                <span style={{ backgroundColor: 'red', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                <span style={{ backgroundColor: 'black', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                <span style={{ backgroundColor: 'blue', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                </div>
                <div className="info-card">
                    <span>{product.modelo}</span>
                    <span>{product.marcaTipo}</span>
                </div>
                <div className="info-price">
                <h3>{product.precio}</h3>
                <span>Con papeles</span>
                </div>
            </div>
            <div>
                <Link href={`/products/${product.id}`}>
                <span>Ver más</span>
                <i className="fas fa-chevron-right"></i>
                </Link>
            </div>
        </div>
    );
}

export default ProductCard;