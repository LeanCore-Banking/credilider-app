// QuoteColDetail.tsx
'use server'

import { Quote } from "@/app/lib/definitions";
import "./styles.css";
import { fetchQuotes } from "@/app/lib/data";

type QuoteColDetailProps = {
    quoteDefault: Quote[]; 

};

const QuoteColDetail: React.FC<QuoteColDetailProps> = async ({ quoteDefault}) => {
     const quotesDefaut = quoteDefault;
    // Función para manejar el envío del formulario
    const handleSubmit = async (formData: FormData) => {
        'use server'
        // Aquí puedes procesar los datos enviados al servidor
        const initialFee = formData.get('initialFee');
        const discount = formData.get('discount');
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        
        const dataToSend = {
            initialFee,
            discount,
            name,
            email,
            phone,
        };
        
        console.log("Datos del formulario enviados:", dataToSend);
        // Aquí puedes realizar una llamada a tu API para enviar los datos
        // await fetch('/api/send-quote', {
            //     method: 'POST',
            //     body: JSON.stringify(dataToSend),
            //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // });
                
                return dataToSend
                
            };
            
    return (
        <div className="col-detail">
            <form action={handleSubmit}>   
                <div className="inputs-row">
                    <span>Cotizar esta moto</span>
                    <div className="inputs-values">
                        <div id="input-cuota-inicial">
                            <label>Cuota inicial</label>
                            <input type="text" name="initialFee" />
                        </div>
                        <div id="input-descuento">
                            <label>Descuento %</label>
                            <input type="text" name="discount" />
                        </div>
                        <div id="valor-financiar">
                            <label>Valor a financiar</label>
                            <div>$60.0000</div>
                        </div>
                    </div>
                </div>

                <div className="quotes-content">
                    <div className="data-container">
                        {quotesDefaut.map((item, index) => (
                            <div key={index} className="quote-data-row">
                                <div className="quote_data-head">
                                    <h3>Cuota mensual</h3>
                                    <span id="quote-value">${item.monthlyFee.toLocaleString()}</span>
                                    <span id="quote-month">{item.monthlyRate} Meses</span>
                                </div>
                                <div className="quote-body">
                                    <div>
                                        <span>Tasa efectiva anual</span>
                                        <span>{item.annualEffectiveRate}%</span>
                                    </div>
                                    <div>
                                        <span>Tasa mensual vencida</span>
                                        <span>{item.monthlyCupDue}%</span>
                                    </div>
                                    <div>
                                        <span>Seguro vida (mes)</span>
                                        <span>${item.monthLifeInsurance.toLocaleString()}</span>
                                    </div>
                                    <div className="value-to-pay">
                                        <span>Valor a pagar</span>
                                        <span>${(item.monthlyFee * item.monthlyRate).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="inputs-bottom-content">
                    <div>
                        <label>Nombre y apellido</label>
                        <input type="text" name="name" />
                    </div>
                    <div>
                        <label>Escribir el correo</label>
                        <input type="text" name="email" />
                    </div>
                    <div>
                        <label>Escribir el teléfono</label>
                        <input id="bottom-content-input" type="text" name="phone" />
                    </div>
                </div>

                <div id="p-detail-btn-send">
                    <button type="submit">Enviar cotización</button>
                </div>
            </form>
        </div>
    );
}

export default QuoteColDetail;
