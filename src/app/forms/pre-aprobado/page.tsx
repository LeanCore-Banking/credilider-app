'use client'
import { useRouter } from 'next/navigation';
import './styles.css';
import '../solicitud-credito/index.css';
import { useState } from 'react';
import ProgressBar from '@/components/ProgressBar/Index';
import { robotoCondensed } from '@/app/fonts/fonts';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import PopupSlider from '@/components/DialogOptions/Index';
import { checkLeadStatus, createLead, generateOtp, getLeadByNit, queryUser, updateLead, verifyAndCheckOtp } from '@/app/lib/actions';
import { getAuthToken } from '@/app/lib/auth';
import { IFormData, userFormToData, userFormToVariables,  } from '@/app/lib/mapper/user';
import { formatNumber } from '@/utils/format';

interface ICreateLead {
  additional_data: {
    variables_data: any[];
  };
  [key: string]: any;
}

interface UserForm extends IFormData {
  otp: string;
  incomes: string;
  expenses: string;
  tipoContrato: string;
  numeroDependientes: string;
  comparendosPendientes: string;
  deudasActuales: string;
}

const PreaprobadoForm = () => {
  const [popUpOtpOpen, setPopUpOtp] = useState(false);
  const [responseOtp, setOtpResponse] = useState<{ userId: string, respSendOtp: string } | null>(null);
  const [response, setResponse] = useState('');
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombreApellido: '',
    incomes: '',
    telefono: '',
    email: '',
    cedula: '',
    tipoDocumento: 'CC',
    expenses: '',
    fechaExpedicion: '',
    cuotaInicial: '',
    otp: '',
    tipoContrato: '',
    antiguedadEmpresa: '',
    numeroDependientes: '',
    comparendosPendientes: '',
    deudasActuales: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [preApprovalMessage, setPreApprovalMessage] = useState('');

  const preAprobadoBtnHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('formData', JSON.stringify(formData));

    setIsLoading(true);
    setPopUpOtp(true);

    try {
      // Primero verificamos si el lead existe
      const existingLead = await getLeadByNit(formData.cedula);
      console.log("existingLead:", existingLead);
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación--------');
      }

      const userId = await requestCreateLead({
        data: formData,
        token: token,
        alreadyExists: existingLead && existingLead.error !== "Not Found",
        userId: existingLead?.id || null,
      });

      const result = await checkProcessWithRetry(
        userId,
        token,
        4,
        2000,
        setIsLoading,
        setIsError,
        setUser,
        setIsSuccessful
      );

      // Manejar la respuesta
      if (result === 'discarded') {
        setPreApprovalMessage('Cupo denegado');
      } else if (result === null) {
        setPreApprovalMessage('Error en el proceso');
      } else if (result?.available_quota) {
        const formattedQuota = new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP'
        }).format(result.available_quota);
        setPreApprovalMessage(`${formattedQuota}`);
      }

      // Luego generamos el OTP
      const otpResp = await generateOtp(formData, userId);
      console.log('otpResp:', otpResp);
      setPopUpOtp(true);
      //setOtpResponse({ userId: otpResp.userId, respSendOtp: otpResp.respSendOtp });

    } catch (error) {
      console.error("Error en el proceso:", error);
      setIsError(true);
      setPreApprovalMessage('Error en el proceso');
    } finally {
      setIsLoading(false);
    }
  };

  const otpSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    const otp = formData.otp
    console.log('otpFromOtpSubmit:', responseOtp)

    if (responseOtp) {
      const response = await verifyAndCheckOtp(otp, responseOtp.userId);
      console.log('responseVeriFyAndCheckOpt:', response)
      setResponse(response.chekOptStatus)
    }

  }

  // Modifica el handleInputChange para campos numéricos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Lista de campos que necesitan formato numérico
    const numericFields = ['incomes', 'expenses', 'cuotaInicial', 'deudasActuales'];
    
    if (numericFields.includes(name)) {
      // Guarda el valor sin formato en el estado
      const rawValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: rawValue }));
      
      // Actualiza el valor mostrado en el input con formato
      e.target.value = formatNumber(value);
    } else {
      // Para campos no numéricos, mantén el comportamiento original
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({ ...prev, tipoDocumento: value }));
  };

  const handleCloseBtn = () => {
    setPopUpOtp(false);
    setResponse('');
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const requestCreateLead = async ({
    data,
    token,
    alreadyExists,
    userId = null,
}: {
    data: UserForm;
    token: string;
    alreadyExists: boolean;
    userId: string | null;
}): Promise<string> => {
    try {
        const formattedData = userFormToData(data);
        const payload: ICreateLead = {
            ...formattedData,
            additional_data: {
                variables_data: userFormToVariables(data),
            },
        };

        // Si ya existe el lead, se actualiza
        if (alreadyExists && userId != null) {
         
            const lead = await updateLead({
                userId,
                data: payload,
                token,
            });
            console.log("[requestCreateLead] update lead", lead);
            return lead.id;
        } else {
            // const token = await accessToken();
            const lead = await createLead(payload);
            console.log("[requestCreateLead] create lead", lead);
            return lead.id;
        }
    } catch (error) {
        console.error("[requestCreateLead] error", error);
        throw error;
    }
};

const checkProcess = async (userId: string, token: string) => {
    const leadStatus = await checkLeadStatus(userId);

    console.log("leadStatus#####:", leadStatus);
    // Si el lead fue descartado
    if (leadStatus === "discarded") {
        return 'discarded';
    }
    // Si el lead no existe, se consulta el usuario
    if (leadStatus === "not_found") {
      console.log("leadNoFound:", leadStatus);
        try {
            const userData = await queryUser({ token, userId });
            console.log("userData#####:", userData);
            return userData;
        } catch (error) {
            return null;
        }
    }
    return undefined;
};

const checkProcessWithRetry = async (
    userId: string, 
    token: string, 
    attempts: number,
    delay: number,
    setLoading?: (value: boolean) => void,
    setIsError?: (value: boolean) => void,
    setUser?: (value: any) => void,
    setIsSuccessful?: (value: boolean) => void
): Promise<any> => {
    try {
        setLoading?.(true);
        const result = await checkProcess(userId, token);
        console.log(`Intento ${4-attempts}/4 - resultCheckProcess:`, result);

        // Si el resultado es undefined (no hay respuesta aún), continuamos con los reintentos
          if (result === undefined || result === null && attempts > 1) {
            // Esperamos antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Llamada recursiva con un intento menos
            return checkProcessWithRetry(
                userId, 
                token, 
                attempts - 1, 
                delay,
                setLoading,
                setIsError,
                setUser,
                setIsSuccessful
            );
        }

        // Procesamos el resultado final
        if (result === null) {
            setIsError?.(true);
            setLoading?.(false);
            return null;
        }

        // Si hay datos de usuario, es exitoso
        if (result) {
            setUser?.(result);
            setIsSuccessful?.(true);
            setLoading?.(false);
            return result;
        }

        // Si llegamos aquí sin resultado después de todos los intentos
        setLoading?.(false);
        return undefined;
        
    } catch (error) {
        console.error(`[checkProcessWithRetry] error en intento ${5-attempts}/4:`, error);
        if (attempts <= 1) {
            setIsError?.(true);
            setLoading?.(false);
            throw error;
        }
        // Si hay error pero quedan intentos, reintentamos
        await new Promise(resolve => setTimeout(resolve, delay));
        return checkProcessWithRetry(
            userId, 
            token, 
            attempts - 1, 
            delay,
            setLoading,
            setIsError,
            setUser,
            setIsSuccessful
        );
    }
};

  return (
    <div className={`${robotoCondensed.className}`}>
      
      <div className='pre-aprobado-container'>
        <div className='pre-aprobado-title-solicitud-credito'>
          <Link href='/products'>
            <i>
              <ArrowLeft href='/products' />
            </i>
          </Link>
          <h2>Estudio de crèdito</h2>
        </div>
        <ProgressBar currentStep={1} />
        <form className="form-grid" onSubmit={preAprobadoBtnHandler}>
          {/* Primera columna */}
          <div className="column">
            <div className="pre-aprobado-form-group">
              <label htmlFor="nombreApellido">Nombre y apellido</label>
              <input
                id="nombreApellido"
                name="nombreApellido"
                placeholder="Escriba su nombre y apellido"
                value={formData.nombreApellido}
                onChange={handleInputChange}
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="ingresos">Ingresos</label>
              <input
                id="incomes"
                name="incomes"
                placeholder="$"
                value={formData.incomes ? formatNumber(formData.incomes) : ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="telefono">Número de teléfono</label>
              <input
                id="telefono"
                name="telefono"
                placeholder="Escriba su número de teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="tipoContrato">Tipo de Contrato Laboral</label>
              <select
                id="tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione una opción</option>
                <option value="indefinido">Contrato indefinido</option>
                <option value="fijo">Contrato término fijo / obra o labor</option>
                <option value="independiente">Independiente con RUT</option>
                <option value="informal">Informal</option>
              </select>
            </div>
            <div className="pre-aprobado-form-group" id="email-input">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                name="email"
                placeholder="Escriba su correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Segunda columna */}
          <div className="column" id="pre-aprobado-col-2">
            <div className="pre-aprobado-form-group">
              <label htmlFor="cedula">Número de cédula</label>
              <input
                id="cedula"
                name="cedula"
                placeholder="Escriba su número de cédula"
                value={formData.cedula}
                onChange={handleInputChange}
              />
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="cc"
                    checked={formData.tipoDocumento === 'CC'}
                    onChange={() => handleCheckboxChange('CC')}
                  />
                  <label htmlFor="cc">CC</label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="pasaporte"
                    checked={formData.tipoDocumento === 'Pasaporte'}
                    onChange={() => handleCheckboxChange('Pasaporte')}
                  />
                  <label htmlFor="pasaporte">Pasaporte</label>
                </div>
              </div>
            </div>
            <div className="pre-aprobado-form-group" id="pre-aprobado-col-2-expenses">
              <label htmlFor="egresos">Egresos</label>
              <input
                id="expenses"
                name="expenses"
                placeholder="$"
                value={formData.expenses ? formatNumber(formData.expenses) : ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="pre-aprobado-form-group">
              <label htmlFor="numeroDependientes">Número de Dependientes</label>
              <input
                id="numeroDependientes"
                name="numeroDependientes"
                type="text"
                placeholder="Ingrese el número de dependientes"
                value={formData.numeroDependientes}
                onChange={handleInputChange}
              />
            </div>

            {/* Botón de submit */}
          <div className="pre-aprobado-form-group" id="pre-aprobado-btn">
            <button type="submit" id="button-preaprobado">
              Consultar pre-aprobado
            </button>
          </div>
           
          </div>

          {/* Tercera columna */}
          <div className="column">
            <div className="pre-aprobado-form-group">
              <label htmlFor="fechaExpedicion">Fecha expedición</label>
              <input
                id="fechaExpedicion"
                type="date"
                name="fechaExpedicion"
                value={formData.fechaExpedicion}
                onChange={handleInputChange}
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="cuotaInicial">Cuota inicial</label>
              <input
                id="cuotaInicial"
                name="cuotaInicial"
                placeholder="$"
                value={formData.cuotaInicial}
                onChange={handleInputChange}
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="comparendosPendientes">Comparendos de tránsito pendientes</label>
              <select
                id="comparendosPendientes"
                name="comparendosPendientes"
                value={formData.comparendosPendientes}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="deudasActuales">Deudas actuales totales</label>
              <input
                id="deudasActuales"
                name="deudasActuales"
                type="text"
                placeholder="$"
                value={formData.deudasActuales}
                onChange={handleInputChange}
              />
            </div>
            <div className="result-box">
              <div className="result-title">Pre-aprobado por:</div>
              <div id="pre-aprobado-resp">{preApprovalMessage}</div>
            </div>
          </div>

          
        </form>

        <div className='opciones-disponibles'>
          <PopupSlider />
        </div>
      </div>
      <div className="continuar-credito">
        <button onClick={() => router.push('/forms/solicitud-credito')} className="button-continuar">Continuar con mi crédito</button>
      </div>
      {popUpOtpOpen && (
        <div className="popup-otp-preaprobado-form">
          {isLoading ? (
            <div className="popup-otp-preaprobado-content">
              <div className="spinner"></div>
              <p>Estamos validando tu información...</p>
            </div>
          ) : preApprovalMessage ? (
            <div className="otp-response">
              <span>
              ¡Felicidades! Cupo preaprobado por:
              <strong>{preApprovalMessage}</strong>
              </span>
              
              <CheckCircle size={80} color="#B4924E" />
            </div>
          ) : (
            <form className="popup-otp-preaprobado-content" onSubmit={otpSubmitHandler}>
              <h3>INGRESAR OTP</h3>
              <input
                id="otp"
                type="text"
                name="otp"
                onChange={handleInputChange}
                placeholder="Ingresar código"
              />
              <button className="button" type="submit">
                COMPROBAR CÓDIGO
              </button>
            </form>
          )}
          <div className="popup-otp-preaprobado-closeBtn">
            <button onClick={handleCloseBtn} className="button">
              CERRAR
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PreaprobadoForm;
