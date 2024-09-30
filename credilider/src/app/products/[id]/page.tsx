'use client'

import MainImage from "@/components/MainImage/Index";
import { useProduct } from "../../../hooks/useProductDetail";
import './styles.css';


type ProductDetail = {
    params: {
        id: string;
    }
}


const ProductDetails: React.FC<ProductDetail> = ({ params }) => {
    const { id } = params;
    const { data } = useProduct(id);
    console.log(data);


    return (
        <div>
            <h1>Detalles del producto</h1>
            <div className="detail-container">
                <div className="col-detail detail-img">
                    {/* IMAGE detail Product Carrousel component */}
                    <MainImage />
                    <div>
                        <div className="name">
                            <span>Model</span>
                            <span>marca</span>
                        </div>
                        <div className="colors-list">
                            <span style={{ backgroundColor: 'red', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                            <span style={{ backgroundColor: 'black', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                            <span style={{ backgroundColor: 'blue', borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px' }}></span>
                        </div>

                        <div>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates.
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum odio beatae ipsum tempore,
                                necessitatibus voluptates quis? Quasi adipisci consequuntur reiciendis voluptatum,
                                culpa enim tempore expedita vero possimus? Ratione, alias ut!
                            </p>
                        </div>
                        <div>
                            <span>Price desde: $ {data?.precio}</span>
                            <span>Con papeles</span>
                        </div>

                    </div>

                </div>

                <div className="col-detail">

                    <div className="inputs-row">
                        <h2>Cotizar esta moto</h2>
                        <div className="inputs-values">
                            <div>
                                <label>Cuota inicial</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Descuento %</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>valor a financiar</label>
                                <div>$60.0000</div>
                            </div>
                        </div>
                    </div>

                    <div className="quotes-content">

                        <div className="quote-data-row">
                            <div className="quote_data-head">
                                <span>Cuota mensual</span>
                                <span id="quote-value">$1200.000</span>
                                <span id="quote-month">24 meses</span>
                            </div>
                            <div className="quote_data-content">
                                <div>
                                    <span>Taza efectiva anual</span>
                                    <span>16%</span>
                                </div>
                                <div>
                                    <span>Taza mensual vencida</span>
                                    <span>16.2%</span>
                                </div>
                                <div>
                                    <span>Seguro vida (mes)</span>
                                    <span>$45.000</span>
                                </div>
                                <div>
                                    <span>Total valor a pagar </span>
                                    <span>$82.000.456</span>
                                </div>

                            </div>
                        </div>
                        <span className="vertical-line"></span>
                        <div className="quote-data-row">
                            <div className="quote_data-head">
                                <span>Cuota mensual</span>
                                <span id="quote-value">$1200.000</span>
                                <span id="quote-month">36 meses</span>
                            </div>
                            <div className="quote_data-content">
                                <div>
                                    <span>Taza efectiva anual</span>
                                    <span>16%</span>
                                </div>
                                <div>
                                    <span>Taza mensual vencida</span>
                                    <span>16.2%</span>
                                </div>
                                <div>
                                    <span>Seguro vida (mes)</span>
                                    <span>$45.000</span>
                                </div>
                                <div>
                                    <span>Total valor a pagar </span>
                                    <span>$82.000.456</span>
                                </div>

                            </div>

                        </div>
                        <span className="vertical-line"></span>
                        <div className="quote-data-row">
                            <div className="quote_data-head">
                                <span>Cuota mensual</span>
                                <span id="quote-value">$1200.000</span>
                                <span id="quote-month">48 meses</span>
                            </div>
                            <div className="quote-data-content">
                                <div>
                                    <span>Taza efectiva anual</span>
                                    <span>16%</span>
                                </div>
                                <div>
                                    <span>Taza mensual vencida</span>
                                    <span>16.2%</span>
                                </div>
                                <div>
                                    <span>Seguro vida (mes)</span>
                                    <span>$45.000</span>
                                </div>
                                <div>
                                    <span>Total valor a pagar </span>
                                    <span>$82.000.456</span>
                                </div>

                            </div>

                        </div>
                        
                    </div>


                        <div className="inputs-bottom-content">
                            <div>
                                <label>Nombre y apellido</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Escribir el correo</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label>Escribir el telefono</label>
                                <input id="bottom-content-input" type="text" />
                            </div>
                        </div>

                        <div id="p-detail-btn-send">
                            <button >
                                Enviar cotización
                            </button>
                        </div>

                </div>

            </div>

        </div>
    )

}

export default ProductDetails;

