'use server'

import MainImage from "@/components/MainImage/Index";
//import { useProduct } from "../../../hooks/useProductDetail";
import './styles.css';
import QuoteColDetail from "@/components/QuoteColDetail/Index";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "@/app/lib/definitions";
import { defaultQuotes } from "@/app/lib/default-data";
import { fectchMotoById } from "@/app/lib/data";
import { Suspense } from 'react';
import { Head } from "@/components/Head/Index";



type ProductDetail = {
    params: {
        id: string;
    }
}
const ProductDetails: React.FC<ProductDetail> = async ({ params }) => {
    const { id } = params;

    console.log('id:', id);

   const motoData = await fectchMotoById(id);
    console.log('motodata:', motoData);

    return (
        <div>
            <div className="detail-container">
                <section className="col-detail" id="col-detail-img">
                    {/* Img detail Product Carrousel component */}
                   
                    <MainImage data={motoData} />
                    
                    <div className="block-description-container">
                        <header id="header">
                            <div className="name">
                                <span id="modelo">{motoData.modelo}</span>
                                <span id="marca-tipo">{motoData.marcaTipo}</span>
                            </div>
                            <div className="colors-list">
                                <span style={{ backgroundColor: 'red', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                                <span style={{ backgroundColor: 'black', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                                <span style={{ backgroundColor: 'blue', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                            </div>
                        </header>

                        <div id="detail-description">
                            <p>
                               {motoData.descripcion}
                            </p>
                        </div>
                        <div id="price-container">
                            <span >Precio desde:  </span>
                            <span className="value-field"> ${motoData.precio.toLocaleString('es-ES')}</span>
                            <span id="price-container-disclaimer">Valor con papeles</span>
                        </div>

                    </div>
                </section>
                <div className="vertical-line-section"></div>
                {/* convertir en componente cliente */}
                <Suspense fallback={<div>Loading...#</div>}>
                    <QuoteColDetail quoteDefault={defaultQuotes} price={motoData.precio} />
                </Suspense>
            </div>

        </div>
    )
}

export default ProductDetails;

