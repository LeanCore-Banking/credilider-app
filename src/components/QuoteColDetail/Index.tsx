'use client'
import { useEffect } from "react"
import { Moto, Quote } from "@/app/lib/definitions"
import "./styles.css"
import Link from "next/link"
import { CheckCircle, User, Mail, Phone } from "lucide-react"
import { QuotesCardSkeleton } from "../skeletons"
import { formatNumber } from "@/utils/format"
import { useQuoteStore } from "@/store/quoteStore"
import FormInput from "../common/FormInput"
import useAuth from "@/auth/hooks"

type QuoteColDetailProps = {
    quoteDefault: Quote[]
    data: Moto
}

const QuoteColDetail: React.FC<QuoteColDetailProps> = ({ quoteDefault, data }) => {
    const store = useQuoteStore()

    const auth = useAuth();
    const financialEntityId = auth.getCurrentFintech()//'89949613-2a1d-4b46-9961-4379d05b2fc6'
   
    // Crear array de quotes por defecto con todas las propiedades requeridas
    const defaultQuotes: Quote[] = [
        {
            initialFee: 0,
            discount: 0,
            financeValue: 0,
            documentos: 0,
            monthlyFee: 0,
            annualEffectiveRate: 0,
            monthlyCupDue: 0,
            monthlyRate: 24,
            monthLifeInsurance: 0
        },
        {
            initialFee: 0,
            discount: 0,
            financeValue: 0,
            documentos: 0,
            monthlyFee: 0,
            annualEffectiveRate: 0,
            monthlyCupDue: 0,
            monthlyRate: 36,
            monthLifeInsurance: 0
        },
        {
            initialFee: 0,
            discount: 0,
            financeValue: 0,
            documentos: 0,
            monthlyFee: 0,
            annualEffectiveRate: 0,
            monthlyCupDue: 0,
            monthlyRate: 48,
            monthLifeInsurance: 0
        }
    ];

    // Usar los quotes del store si existen, si no usar los por defecto
    const quotesToShow = store.quotes.length > 0 ? store.quotes : defaultQuotes;

    // Efecto inicial para establecer valores por defecto
    useEffect(() => {
        if (data) {
            store.setCurrentMoto(data)
            store.setMotoValue(data.precio)
            // Establecer la garantía inicial
            const garantiaValue = data.garantia ? Number(data.garantia) : 0
            store.setGarantia(garantiaValue)

            // Calcular el valor total inicial a financiar
            const totalValue = data.precio + garantiaValue + store.documentos
            store.setFinanceValue(totalValue)

            // Removemos la petición inicial
            // store.fetchQuotesData(data, store.financialEntityId)
        }
    }, [data])

    // Efecto para recalcular el valor a financiar cuando cambien los valores relevantes
    useEffect(() => {
        if (store.motoValue !== null) {
            const discountAmount = store.motoValue * (store.discount / 100)
            const valueAfterDiscount = store.motoValue - discountAmount
            const additionalCosts = store.garantia + store.documentos
            const totalValue = valueAfterDiscount + additionalCosts - store.initialFee
            store.setFinanceValue(totalValue >= 0 ? totalValue : 0)
        }
    }, [
        store.motoValue,
        store.initialFee,
        store.discount,
        store.garantia,
        store.documentos
    ])

    // Efecto para fetchear quotes cuando cambia financeValue y existe cuota inicial
    useEffect(() => {
        if (store.financeValue !== null &&
            store.motoValue &&
            store.initialFee > 0) {  // Solo si hay cuota inicial
            store.fetchQuotesData(data, financialEntityId);
        }
    }, [store.financeValue, store.initialFee]) // Agregamos initialFee como dependencia

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { userData } = store
        if (!userData.name || !userData.email || !userData.phone || !userData.nit) {
            Object.entries(userData).forEach(([key, value]) => {
                store.validateField(key, value)
            })
            return
        }

        // Guardar los datos relevantes en localStorage
        const formDataToSave = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            nit: userData.nit,
            initialFee: store.initialFee,
            financeValue: store.financeValue,
            motoValue: store.motoValue,
            garantia: store.garantia,
            documentos: store.documentos,
            discount: store.discount
        }
        localStorage.setItem('formData', JSON.stringify(formDataToSave))

        await store.fetchQuotesData(data, financialEntityId);
        store.setPopupVisible(true)
    }

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
                                defaultValue={data?.precio ? formatNumber(data.precio.toString()) : '0'}
                                onChange={(e) => {
                                    const formattedValue = formatNumber(e.target.value);
                                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                    e.target.value = formattedValue;
                                    store.debouncedSetMotoValue(Number(numericValue) || null);
                                }}
                            />
                        </div>
                        <div id="input-garantia">
                            <label>Garantía</label>
                            <input
                                type="text"
                                name="garantia"
                                defaultValue={data?.garantia ? formatNumber(data.garantia.toString()) : '0'}
                                onChange={(e) => {
                                    const formattedValue = formatNumber(e.target.value);
                                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                    e.target.value = formattedValue;
                                    store.debouncedSetGarantia(Number(numericValue) || 0);
                                }}
                            />
                        </div>
                        <div id="input-documentos">
                            <label>Documentos</label>
                            <input
                                type="text"
                                name="documentos"
                                onChange={(e) => {
                                    const formattedValue = formatNumber(e.target.value);
                                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                    e.target.value = formattedValue;
                                    store.debouncedSetDocumentos(Number(numericValue) || 0);
                                }}
                            />
                        </div>
                        <div id="input-cuota-inicial">
                            <label>Cuota inicial (Min. 15%)</label>
                            <input
                                type="text"
                                name="initialFee"
                                onChange={(e) => {
                                    const formattedValue = formatNumber(e.target.value);
                                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                    e.target.value = formattedValue;
                                    store.debouncedSetInitialFee(Number(numericValue) || 0);
                                }}
                                onBlur={(e) => store.validateField('initialFee', e.target.value)}
                            />
                            {store.errors.initialFee && (
                                <span className="error-message-quotes">{store.errors.initialFee}</span>
                            )}
                        </div>
                        <div id="input-descuento">
                            <label>Descuento %</label>
                            <input
                                type="text"
                                name="discount"
                                onChange={(e) => {
                                    const formattedValue = formatNumber(e.target.value);
                                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                    e.target.value = formattedValue;
                                    store.debouncedSetDiscount(Number(numericValue) || 0);
                                }}
                            />
                        </div>

                        <div id="valor-financiar">
                            <label>Valor a financiar</label>
                            <input
                                type="text"
                                disabled
                                value={store.financeValue !== null
                                    ? `$${store.financeValue.toLocaleString()}`
                                    : "$0"
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="quotes-content">
                    <div className="data-container">
                        {store.loading ? (
                            <QuotesCardSkeleton />
                        ) : (
                            quotesToShow.map((item, index) => (
                                <div key={index} className="quote-data-row">
                                    <div className="quote_data-head">
                                        <h3>Cuota mensual</h3>
                                        <span id="quote-value">
                                            ${Math.round((item?.monthlyFee || 0) / 100).toLocaleString()}
                                        </span>
                                        <span id="quote-month">{item?.monthlyRate || 0} Meses</span>
                                    </div>
                                    <div className="quote-body">
                                        {/*<div>
                                            <span>Tasa mensual vencida</span>
                                            <span>{item?.monthlyCupDue || 0}%</span>
                                        </div>*/}
                                        {/*<div>
                                            <span>Seguro vida (mes)</span>
                                            <span>${(item?.monthLifeInsurance || 0).toLocaleString()}</span>
                                        </div>*/}
                                        <div>
                                            <span>Garantía</span>
                                            <span>${(store.garantia || 0).toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span>Documentos</span>
                                            <span>${(store.documentos || 0).toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span>Cuota inicial</span>
                                            <span>${(store.initialFee || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="value-to-pay">
                                            <span>Valor a financiar</span>
                                            <span>
                                                ${((store.quotes.length > 0 ? store.financeValue : 0) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="inputs-bottom-content">

                    <FormInput
                        label="Nombre y apellido"
                        name="name"
                        placeholder="Escriba su nombre y apellido"
                        value={store.userData.name}
                        error={store.errors.name}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            store.setUserData({ ...store.userData, [name]: value });
                        }}
                        onBlur={() => store.validateField('name', store.userData.name)}
                    />

                    <FormInput
                        label="Escribir el NIT o CC"
                        name="nit"
                        placeholder="Escriba su NIT o CC"
                        value={store.userData.nit}
                        error={store.errors.nit}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            store.setUserData({ ...store.userData, [name]: value });
                        }}
                        onBlur={() => store.validateField('nit', store.userData.nit)}
                    />

                    <FormInput
                        label="Escribir el correo"
                        name="email"
                        placeholder="Escriba su correo electrònico"
                        value={store.userData.email}
                        error={store.errors.email}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            store.setUserData({ ...store.userData, [name]: value });
                        }}
                        onBlur={() => store.validateField('email', store.userData.email)}
                    />

                    <FormInput
                        label="Escribir el teléfono"
                        name="phone"
                        placeholder="Escriba su numero de telefono"
                        value={store.userData.phone}
                        error={store.errors.phone}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            store.setUserData({ ...store.userData, [name]: value });
                        }}
                        onBlur={() => store.validateField('phone', store.userData.phone)}
                    />

                </div>
                <div id="p-detail-btn-send">
                    <button type="submit">Enviar cotización</button>
                </div>

            </form>

            {/* Popup */}
            {store.popupVisible && (
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
                            <p><User size={15} /> {store.userData.name}</p>
                            <p><Mail size={15} /> {store.userData.email}</p>
                            <p><Phone size={15} /> {store.userData.phone}</p>
                        </div>
                        <Link href="/forms/pre-aprobado">
                            <button className="green-button-quotesColDetail">PEDIR CRÈDITO YA</button>
                        </Link>
                        <div className="popup-quotesColDetail-closeBtn">
                            <button onClick={() => store.setPopupVisible(false)}>CERRAR</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteColDetail;
