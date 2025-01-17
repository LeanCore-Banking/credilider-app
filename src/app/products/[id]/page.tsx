'use client'

import MainImage from "@/components/MainImage/Index";
import './styles.css';
import QuoteColDetail from "@/components/QuoteColDetail/Index";
import { defaultQuotes } from "@/app/lib/default-data";
import { fectchMotoById } from "@/app/lib/data";
import { useQuery } from "@tanstack/react-query";
import { ProductDetailSkeleton } from "@/components/skeletons";

type ProductDetail = {
    params: {
        id: string;
    }
}

const ProductDetails: React.FC<ProductDetail> = ({ params }) => {
    const { id } = params;

    const { data: motoData, isLoading, error } = useQuery({
        queryKey: ['moto', id],
        queryFn: () => fectchMotoById(id),
        staleTime: 30 * 24 * 60 * 60 * 1000, // 30 días
        gcTime: 31 * 24 * 60 * 60 * 1000, // 31 días
        refetchOnWindowFocus: false,
    });

    if (isLoading) return <div><ProductDetailSkeleton/></div>;
    if (error) return <div>Error al cargar los datos</div>;
    if (!motoData) return <div>No se encontró la moto</div>;

    return (
        <div>
            <div className="detail-container">
                <section className="col-detail" id="col-detail-img">

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
                            <span className="value-field"> ${motoData?.precio.toLocaleString('es-ES')}</span>
                            <span id="price-container-disclaimer">Valor con papeles</span>
                        </div>

                    </div>

                </section>
                <div className="vertical-line-section"></div>
                <QuoteColDetail quoteDefault={defaultQuotes} data={motoData} />
            </div>

        </div>
    )
}

export default ProductDetails;

