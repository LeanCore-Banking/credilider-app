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
                    <Suspense fallback={<div>Loading...Main</div>}>
                    <MainImage data={motoData} />
                    </Suspense>
                    <div className="block-description-container">
                        <header id="header">
                            <div className="name">
                                <span id="modelo">GSX-S1000</span>
                                <span id="marca-tipo">Suzuki / Alto cilindraje</span>
                            </div>
                            <div className="colors-list">
                                <span style={{ backgroundColor: 'red', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                                <span style={{ backgroundColor: 'black', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                                <span style={{ backgroundColor: 'blue', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                            </div>
                        </header>

                        <div id="detail-description">
                            <p>
                                El placer del rendimiento absoluto.
                                La GSX-S1000 es más que capaz de ofrecer la emocionante experiencia de conducción y el rendimiento ideal de una motocicleta deportiva lista para el entorno de conducción actual. La potencia es suministrada por un motor de cuatro tiempos DOHC refrigerado por líquido de 999 cm3 de alto rendimiento, que hereda el verdadero ADN de las superbikes ganadoras. Este motor adaptado para la calle se basa en una arquitectura central que se beneficia del conocimiento adquirido durante décadas de desarrollo de la GSX-R1000 para ganar innumerables victorias en carreras, así como tecnologías avanzadas desarrolladas para las carreras de MotoGP.
                            </p>
                        </div>
                        <div id="price-container">
                            <span >Precio desde:  </span>
                            <span className="value-field"> $ {motoData.precio}</span>
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

