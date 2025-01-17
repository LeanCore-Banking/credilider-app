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
import { calculateICPWithSimulationLoan, checkLeadStatus, createLead, dataFintech, generateOtp, getLeadByNit, queryUser, updateLead, verifyAndCheckOtp } from '@/app/lib/actions';
import { getAuthToken } from '@/app/lib/auth';
import { IFormData, userFormToData, userFormToVariables, } from '@/app/lib/mapper/user';
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
  contrato_laboral: string;
  'number-dependants': string;
  deudas_transito: string;
  deudas_actuales: string;
  antigüedad_empresa: string;
  cuota_inicial: string;
}

interface User {
  available_quota?: number;
}

const PreaprobadoForm = () => {
  const [popUpOtpOpen, setPopUpOtp] = useState(false);
  const [responseOtp, setOtpResponse] = useState<{ userId: string, respSendOtp: string } | null>(null);
  const [response, setResponse] = useState('');
  const router = useRouter();
  const [formData, setFormData] = useState(() => {
    // Intentar obtener datos del localStorage
    const savedData = localStorage.getItem('formData');
    console.log("savedData:", savedData);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Mapear los datos del localStorage a la estructura del formulario
        return {
          nombreApellido: parsedData.name || '',
          incomes: '',
          telefono: parsedData.phone || '',
          email: parsedData.email || '',
          cedula: parsedData.nit || '',
          tipoDocumento: 'CC',
          expenses: '',
          fechaExpedicion: '',
          fecha_nacimiento: '',
          cuota_inicial: parsedData.initialFee?.toString() || '',
          valor_financiar: parsedData.financeValue?.toString() || '',
          otp: '',
          contrato_laboral: '',
          antigüedad_empresa: '',
          'number-dependants': '',
          deudas_transito: '',
          deudas_actuales: '',
          cuotas: '',
        };
      } catch (error) {
        console.error('Error al parsear datos del localStorage:', error);
      }
    }
    // Estado inicial por defecto
    return {
      nombreApellido: '',
      incomes: '',
      telefono: '',
      email: '',
      cedula: '',
      tipoDocumento: 'CC',
      expenses: '',
      fechaExpedicion: '',
      fecha_nacimiento: '',
      cuota_inicial: '',
      valor_financiar: '',
      otp: '',
      contrato_laboral: '',
      antigüedad_empresa: '',
      'number-dependants': '',
      deudas_transito: '',
      deudas_actuales: '',
      cuotas: '',
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [preApprovalMessage, setPreApprovalMessage] = useState('');

  const preAprobadoBtnHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guardar los datos del formulario en localStorage antes de continuar
    localStorage.setItem('formData', JSON.stringify(formData));

    setIsLoading(true);
    setPopUpOtp(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      // Calcular ICP desde el servidor
      const icpCalculation = await calculateICPWithSimulationLoan(
        formData.valor_financiar,
        formData.cuotas,
        formData.incomes,
        formData.expenses,
        formData.deudas_actuales,
        formData.deudas_transito
      );

      // Procesar el valor del ICP
      const icpValue = parseFloat(icpCalculation.icp);
      let icpStatus = '';

      if (icpValue < 0.25) {
        icpStatus = 'excepcional';
      } else if (icpValue >= 0.25 && icpValue < 0.35) {
        icpStatus = 'adecuado';
      } else if (icpValue >= 0.35 && icpValue < 0.45) {
        icpStatus = 'ajustado';
      } else {
        icpStatus = 'deficiente';
      }

      // Actualizar formData con los resultados y el estado del ICP
      const updatedFormData = {
        ...formData,
        ...icpCalculation,
        icp: icpStatus // Sobreescribir el valor numérico con el estado
      };

      console.log("updatedFormData:", updatedFormData);

      // Guardar en localStorage el formData actualizado
      localStorage.setItem('formData', JSON.stringify(updatedFormData));

      // Continuar con el proceso existente usando el formData actualizado
      const existingLead = await getLeadByNit(updatedFormData.cedula);

      const userId = await requestCreateLead({
        data: updatedFormData, // Enviamos el formData con el ICP incluido
        token: token,
        alreadyExists: existingLead && existingLead.error !== "Not Found",
        userId: existingLead?.id || null,
      });

      const result = await checkProcessWithRetry(
        userId,
        token,
        10,
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
      } else if (result?.available_quota !== undefined) {
        if (result.available_quota === 0) {
          setPreApprovalMessage('Cupo denegado');
        } else {
          const formattedQuota = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
          }).format(result.available_quota);
          setPreApprovalMessage(`${formattedQuota}`);

          const otpResp = await generateOtp(updatedFormData, userId);
          setPopUpOtp(true);
          setOtpResponse({ userId: otpResp.userId, respSendOtp: otpResp.respSendOtp });
        }
      }

    } catch (error: any) {
      console.error("Error en el proceso:", error);
      setIsError(true);
      setPreApprovalMessage(error.message || 'Ha ocurrido un error en el proceso');
    } finally {
      setIsLoading(false);
    }
  };

  const otpSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    const otp = formData.otp
    console.log("otp:", otp);
    console.log('otpFromOtpSubmit:', responseOtp)

    if (responseOtp) {
      try {
        const response = await verifyAndCheckOtp(otp, responseOtp.userId);
        console.log('responseVeriFyAndCheckOpt:', response)
        setOtpResponse(response.chekOptStatus)

        // Verificar si el OTP fue verificado correctamente
        if (response.chekOptStatus.status === 'verified') {
          // Mostrar el mensaje de preaprobación
          if (user && (user.available_quota !== undefined || user.available_quota === 0)) {
            const formattedQuota = new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP'
            }).format(user.available_quota);
            setPreApprovalMessage(formattedQuota);
          } else {
            setPreApprovalMessage('Error en el proceso');
          }
        }
      } catch (error) {
        console.error('Error al verificar OTP:', error);
        setPreApprovalMessage('Error en el proceso');
      }
    }
  }

  // Modifica el handleInputChange para campos numéricos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Lista de campos que necesitan formato numérico
    const numericFields = ['incomes', 'expenses', 'cuota_inicial', 'deudas_actuales', 'valor_financiar'];

    if (numericFields.includes(name)) {
      // Guarda el valor sin formato en el estado
      const rawValue = value.replace(/\D/g, '');
      setFormData((prev: any) => ({ ...prev, [name]: rawValue }));

      // Actualiza el valor mostrado en el input con formato
      e.target.value = formatNumber(value);
    } else {
      // Para campos no numéricos, mantén el comportamiento original
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, tipoDocumento: value }));
  };

  const handleCloseBtn = () => {
    setPopUpOtp(false);
    setResponse('');
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
        //console.log("[requestCreateLead] update lead", lead);
        return lead.id;
      } else {
        // const token = await accessToken();
        const lead = await createLead(payload);
        //console.log("[requestCreateLead] create lead", lead);
        return lead.id;
      }
    } catch (error) {
      console.error("[requestCreateLead] error", error);
      throw error;
    }
  };

  const checkProcess = async (userId: string, token: string) => {
    //console.log("userIdFromCheckProcess:", userId);
    const leadStatus = await checkLeadStatus(userId);

    //console.log("leadStatus#####:", leadStatus);
    // Si el lead fue descartado
    if (leadStatus === "discarded") {
      return 'discarded';
    }
    // Si el lead no existe, se consulta el usuario
    if (leadStatus === "not_found") {
      //console.log("leadNoFound:", leadStatus);
      try {
        const userData = await queryUser({ token, userId });
        //console.log("userData#####:", userData);
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
    //console.log("userIdFromCheckProcessWithRetry:", userId);
    try {
      setLoading?.(true);
      const result = await checkProcess(userId, token);
      //console.log(`Intento ${10-attempts}/10 - resultCheckProcess:`, result);

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
      console.error(`[checkProcessWithRetry] error en intento ${10 - attempts}/10:`, error);
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
        {/* Encabezado del formulario */}
        <div className='pre-aprobado-title-solicitud-credito'>
          <Link href='/products'>
            <i>
              <ArrowLeft href='/products' />
            </i>
          </Link>
          <h2>Estudio de crédito</h2>
        </div>
        <ProgressBar currentStep={1} />
        <form className="form-grid" onSubmit={preAprobadoBtnHandler}>
          {/* ==================== COLUMNA 1 ==================== */}
          <div className="column">
            <div className="pre-aprobado-form-group">
              <label htmlFor="nombreApellido">Nombre y apellido</label>
              <input
                id="nombreApellido"
                name="nombreApellido"
                placeholder="Escriba su nombre y apellido"
                value={formData.nombreApellido}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="fechaExpedicion">Fecha expedición documento</label>
              <input
                id="fechaExpedicion"
                type="date"
                name="fechaExpedicion"
                value={formData.fechaExpedicion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                placeholder="Escriba su correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="number-dependants">Número de Dependientes</label>
              <input
                id="number-dependants"
                name="number-dependants"
                type="text"
                placeholder="Ingrese el número de dependientes"
                value={formData['number-dependants']}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="deudas_actuales">Deudas mensuales</label>
              <input
                id="deudas_actuales"
                name="deudas_actuales"
                type="text"
                placeholder="$"
                value={formData.deudas_actuales ? formatNumber(formData.deudas_actuales) : ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="pre-aprobado-form-group">
              <label htmlFor="valor_financiar">Valor a financiar</label>
              <input
                id="valor_financiar"
                name="valor_financiar"
                placeholder="$"
                value={formData.valor_financiar ? formatNumber(formData.valor_financiar) : ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* ==================== COLUMNA 2 ==================== */}
          <div className="column">
            <div className="pre-aprobado-form-group">
              <label htmlFor="tipoDocumento">Tipo de documento</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleSelectChange}
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input
                id="fecha_nacimiento"
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="contrato_laboral">Tipo de Contrato Laboral</label>
              <select
                id="contrato_laboral"
                name="contrato_laboral"
                value={formData.contrato_laboral}
                onChange={handleSelectChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Contrato indefinido">Contrato indefinido</option>
                <option value="Contrato término fijo / obra o labor">Contrato término fijo / obra o labor</option>
                <option value="Independiente con RUT">Independiente con RUT</option>
                <option value="Informal">Informal</option>
              </select>
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="incomes">Ingresos mensuales</label>
              <input
                id="incomes"
                name="incomes"
                placeholder="$"
                value={formData.incomes ? formatNumber(formData.incomes) : ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="deudas_transito">Comparendos de tránsito pendientes</label>
              <input
                id="deudas_transito"
                name="deudas_transito"
                type="text"
                placeholder="$"
                value={formData.deudas_transito ? formatNumber(formData.deudas_transito) : ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="cuota_inicial">Cuota inicial</label>
              <input
                id="cuota_inicial"
                name="cuota_inicial"
                type="text"
                placeholder="$"
                value={formData.cuota_inicial ? formatNumber(formData.cuota_inicial) : ''}
                onChange={handleInputChange}
              />
            </div>

          </div>

          {/* ==================== COLUMNA 3 ==================== */}
          <div className="column">
            <div className="pre-aprobado-form-group">
              <label htmlFor="cedula">Número de documento</label>
              <input
                id="cedula"
                name="cedula"
                placeholder="Escriba su número de documento"
                value={formData.cedula}
                onChange={handleInputChange}
                required
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
                required
              />
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="antigüedad_empresa">Antigüedad en la Empresa</label>
              <select
                id="antigüedad_empresa"
                name="antigüedad_empresa"
                value={formData.antigüedad_empresa}
                onChange={handleSelectChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Más de 24 meses">Más de 24 meses</option>
                <option value="Entre 12 y 24 meses">Entre 12 y 24 meses</option>
                <option value="Entre 6 y 12 meses">Entre 6 y 12 meses</option>
                <option value="Menos de 6 meses">Menos de 6 meses</option>
                <option value="sin_antiguedad">Sin antigüedad</option>
              </select>
            </div>
            <div className="pre-aprobado-form-group">
              <label htmlFor="expenses">Gastos mensuales</label>
              <input
                id="expenses"
                name="expenses"
                placeholder="$"
                value={formData.expenses ? formatNumber(formData.expenses) : ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="pre-aprobado-form-group">
              <label htmlFor="cuotas">Número de cuotas</label>
              <input
                id="cuotas"
                name="cuotas"
                type="number"
                min="1"
                max="84"
                placeholder="Ingrese el número de cuotas"
                value={formData.cuotas}
                onChange={handleInputChange}
                required
              />
            </div>

          </div>
          <div className="pre-aprobado-form-group" id="pre-aprobado-btn">
            <button type="submit" id="button-preaprobado">
              Consultar pre-aprobado
            </button>
          </div>
        </form>

        {/* Sección de opciones disponibles */}
        <div className='opciones-disponibles'>
          <PopupSlider />
        </div>
      </div>
      <div className="continuar-credito">
        <button 
          onClick={() => router.push('/forms/solicitud-credito')} 
          className="button-continuar"
          disabled={!user?.available_quota || user.available_quota <= 0}
          style={{ opacity: user?.available_quota && user.available_quota > 0 ? 1 : 0.5 }}
        >
          Continuar con mi crédito
        </button>
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
                {preApprovalMessage === 'Cupo denegado' || preApprovalMessage === 'Error en el proceso' || preApprovalMessage === 'El usuario ya existe' ? (
                  <>{preApprovalMessage}</>
                ) : (
                  <>
                    ¡Felicidades! Cupo preaprobado por:
                    <strong>{preApprovalMessage}</strong>
                  </>
                )}
              </span>

              {preApprovalMessage !== 'Cupo denegado' && preApprovalMessage !== 'Error en el proceso' && (
                <CheckCircle size={80} color="#B4924E" />
              )}
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
