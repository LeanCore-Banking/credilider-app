'use client'
import { useState, useEffect } from "react";
import { Moto, Quote } from "@/app/lib/definitions";
import "./styles.css";
import { fetchQuotes } from "@/app/lib/actions";
import Link from "next/link";
import { CheckCircle, User, Mail, Phone } from "lucide-react";
import { QuotesCardSkeleton } from "../skeletons";

type QuoteColDetailProps = {
    quoteDefault: Quote[];
    data: Moto;
};

const QuoteColDetail: React.FC<QuoteColDetailProps> = ({ quoteDefault, data }) => {
    const [quotes, setQuotes] = useState<Quote[]>(quoteDefault);
    const [loading, setLoading] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [userData, setUserData] = useState({ name: "", nit: "", email: "", phone: "" });
    const [errors, setErrors] = useState({ name: "", nit: "", email: "", phone: "" });
    const [motoValue, setMotoValue] = useState<number | null>(null);
    const [initialFee, setInitialFee] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [financeValue, setFinanceValue] = useState<number | null>(0);

    // Dentro de QuoteColDetail
    useEffect(() => {
        // Si los valores son válidos, se inicia un timeout para calcular el valor a financiar
        if (motoValue && initialFee >= 0 && discount >= 0) {

            const discountAmount = motoValue * (discount / 100);
            const newFinanceValue = motoValue - discountAmount - initialFee;
            setFinanceValue(newFinanceValue >= 0 ? newFinanceValue : 0); // No permitir valores negativos   
        }
    }, [motoValue, initialFee, discount]);  // Limpieza para cancelar el timeout si cambia alguna dependencia antes de completarse


    useEffect(() => {
        if (financeValue !== null && motoValue && initialFee >= 0 && discount >= 0) {
            handleFetchQuotes(); // Llamar a fetchQuotes cuando se actualice financeValue
        }
    }, [financeValue]);

    // Función para manejar el debounce de las solicitudes
    const debounce = (func: (...args: any[]) => void, delay: number) => {
        let timeout: NodeJS.Timeout | undefined;

        return (...args: any[]) => {
            console.log('debounce:', timeout);
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };
    // Función para hacer la solicitudes a fetchQuotes
    const handleFetchQuotes = async () => {
        if (motoValue && initialFee >= 0 && discount >= 0) {
            setLoading(true);
            try {
                const updatedQuotes = await fetchQuotes(initialFee, discount, financeValue || 0, userData.name, userData.nit, userData.email, userData.phone, data);
                console.log('updatedQuotes:', updatedQuotes);
                setQuotes(updatedQuotes);
            } catch (error) {
                console.error("Error fetching quotes:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const validateField = (name: string, value: string) => {
        let errorMessage = "";

        switch (name) {
            case "name":
                if (!value) {
                    errorMessage = "El nombre es obligatorio.";
                }
                break;
            case "email":
                if (!value) {
                    errorMessage = "El correo es obligatorio.";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    errorMessage = "El formato de correo no es válido.";
                }
                break;
            case "nit":
                if (!value) {
                    errorMessage = "El NIT o Cedula es obligatorio.";
                } else if (!/^\d+$/.test(value)) {
                    errorMessage = "la cedula o Nit deben ser dígitos.";
                }
                break;
            case "phone":
                if (!value) {
                    errorMessage = "El teléfono es obligatorio.";
                } else if (!/^\d{10}$/.test(value)) { // Valida que tenga 10 dígitos
                    errorMessage = "El teléfono debe tener 10 dígitos.";
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    };

    // Manejadores de cambio de input
    const handleMotoValueChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setMotoValue(Number(e.target.value) || null);
        handleFetchQuotes();
    }, 2000)// 2s de retraso para evitar llamadas innecesarias

    const handleInitialFeeChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setInitialFee(Number(e.target.value) || 0);
        handleFetchQuotes();
    }, 2000);

    const handleDiscountChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(Number(e.target.value) || 0);
        handleFetchQuotes();
    }, 2000);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validar antes de enviar
        if (!userData.name || !userData.email || !userData.phone || !userData.nit) {
            validateField("name", userData.name);
            validateField("nit", userData.nit);
            validateField("email", userData.email);
            validateField("phone", userData.phone);
            return;
        }

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const initialFee = parseFloat(formData.get('initialFee') as string) || 0;
        const discount = parseFloat(formData.get('discount') as string) || 0;
        const name = formData.get('name') as string;
        const nit = formData.get('nit') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;

        try {
            // Enviar el valor de financiar actualizado a fetchQuotes
            const updatedQuotes = await fetchQuotes(initialFee, discount, financeValue ?? 0, name, nit, email, phone, data);
            setQuotes(updatedQuotes);
            setUserData({ name, nit, email, phone });
            setPopupVisible(true); // Mostrar popup
        } catch (error) {
            console.error("Error fetching quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        validateField(name, value); // Valida mientras el usuario escribe
    };

    const closePopup = () => {
        setPopupVisible(false);
    };


    return (
        <div className="col-detail">
            <form onSubmit={handleSubmit}>
                <div className="inputs-row">
                    <span>Cotizar esta moto</span>
                    <div className="inputs-values">
                        <div id="input-valor-moto">
                            <label>Valor Moto</label>
                            <input type="text"
                                name="value-moto"
                                onChange={handleMotoValueChange} // Actualiza el valor de moto inicial y aplica debounce
                            />
                        </div>
                        <div id="input-cuota-inicial">
                            <label>Cuota inicial</label>
                            <input
                                type="text"
                                name="initialFee"
                                onChange={handleInitialFeeChange} // Actualiza el valor de cuota inicial y aplica debounce
                            />
                        </div>
                        <div id="input-descuento">
                            <label>Descuento %</label>
                            <input
                                type="text"
                                name="discount"
                                onChange={handleDiscountChange} // Actualiza el valor del descuento y aplica debounce
                            />
                        </div>
                        <div id="valor-financiar">
                            <label>Valor a financiar</label>
                            <div>{financeValue !== null ? `$${financeValue.toLocaleString()}` : ""}</div>
                        </div>
                    </div>
                </div>

                <div className="quotes-content">
                    <div className="data-container">
                        {loading ? (
                            <QuotesCardSkeleton />
                        ) : (
                            quotes.map((item, index) => (
                                <div key={index} className="quote-data-row">
                                    <div className="quote_data-head">
                                        <h3>Cuota mensual</h3>
                                        <span id="quote-value">${item.monthlyFee.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
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
                                            <span>${(item.monthlyFee * item.monthlyRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="inputs-bottom-content">

                    <div>
                        <label>Nombre y apellido</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Escriba su nombre y apellido"
                            value={userData.name}
                            onChange={handleInputChange}
                            onBlur={() => validateField('name', userData.name)} // Validación cuando el campo pierde el foco
                        />
                        {errors.name && <span className="error-message-quotes">{errors.name}</span>}
                    </div>

                    <div>
                        <label>Escribir el NIT o CC</label>
                        <input
                            type="text"
                            name="nit"
                            placeholder="Escriba su NIT o CC"
                            value={userData.nit}
                            onChange={handleInputChange}
                            onBlur={() => validateField('nit', userData.nit)} // Validación cuando el campo pierde el foco
                        />
                        {errors.nit && <span className="error-message-quotes">{errors.nit}</span>}
                    </div>

                    <div>
                        <label>Escribir el correo</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Escriba su correo electrònico"
                            value={userData.email}
                            onChange={handleInputChange}
                            onBlur={() => validateField('email', userData.email)} // Validación cuando el campo pierde el foco
                        />
                        {errors.email && <span className="error-message-quotes">{errors.email}</span>}
                    </div>

                    <div>
                        <label>Escribir el teléfono</label>
                        <input
                            id="bottom-content-input"
                            type="text" name="phone"
                            placeholder="Escriba su numero de telefono"
                            value={userData.phone}
                            onChange={handleInputChange}
                            onBlur={() => validateField('phone', userData.phone)} // Validación cuando el campo pierde el foco
                        />
                        {errors.phone && <span className="error-message-quotes">{errors.phone}</span>}
                    </div>

                </div>
                <div id="p-detail-btn-send">
                    <button type="submit">Enviar cotización</button>
                </div>
                
            </form>

            {/* Popup */}
            {popupVisible && (
                <div className="popup-overlay-quotesColDetail">
                    <div className="popup-quotesColDetail">
                        <div className="popup-quotesColDetail-icon" >
                            <CheckCircle size={80} color="#B4924E" />
                        </div>
                        <div className="popup-quotesColDetail-text">
                            <p>LA COTIZACIÒN</p>
                            <p>FUE ENVIADA</p>
                            <p>EXITOSAMENTE A:</p>
                        </div>
                        <div className="popup-info-quotesColDetail">
                            <p><User size={15} /> {userData.name}</p>
                            <p><Mail size={15} /> {userData.email}</p>
                            <p><Phone size={15} /> {userData.phone}</p>
                        </div>
                    </div>
                    <div className="popup-buttons-quotesColDetail">
                        <div className="popup-quotesColDetail-closeBtn">
                            <button onClick={closePopup}>CERRAR</button>
                        </div>
                        <Link href="/forms/pre-aprobado">
                            <button className="green-button-quotesColDetail">PEDIR CRÈDITO YA</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteColDetail;
