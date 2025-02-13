'use client'
import { create } from 'zustand'
import { Quote, Moto } from "@/app/lib/definitions"
import { fetchQuotes } from "@/app/lib/actions"

// Función de debounce
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

interface QuoteState {
  quotes: Quote[]
  loading: boolean
  popupVisible: boolean
  currentMoto: Moto | null
  financialEntityId: string
  userData: {
    name: string
    nit: string
    email: string
    phone: string
  }
  errors: {
    name: string
    nit: string
    email: string
    phone: string
  }
  motoValue: number | null
  initialFee: number
  discount: number
  financeValue: number | null
  garantia: number
  documentos: number
  
  // Acciones
  setCurrentMoto: (moto: Moto) => void
  setFinancialEntityId: (id: string) => void
  setQuotes: (quotes: Quote[]) => void
  setLoading: (loading: boolean) => void
  setPopupVisible: (visible: boolean) => void
  setUserData: (data: Partial<QuoteState['userData']>) => void
  setErrors: (errors: Partial<QuoteState['errors']>) => void
  setMotoValue: (value: number | null) => void
  setInitialFee: (value: number) => void
  setDiscount: (value: number) => void
  setFinanceValue: (value: number | null) => void
  setGarantia: (value: number) => void
  setDocumentos: (value: number) => void
  
  // Acciones compuestas
  fetchQuotesData: (data: Moto, financialEntityId: string) => Promise<void>
  validateField: (name: string, value: string) => void

  // Agregar las funciones con debounce
  debouncedSetMotoValue: (value: number | null) => void
  debouncedSetInitialFee: (value: number) => void
  debouncedSetDiscount: (value: number) => void
  debouncedSetGarantia: (value: number) => void
  debouncedSetDocumentos: (value: number) => void
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],
  loading: false,
  popupVisible: false,
  currentMoto: null,
  financialEntityId: '89949613-2a1d-4b46-9961-4379d05b2fc6',
  userData: {
    name: "",
    nit: "",
    email: "",
    phone: ""
  },
  errors: {
    name: "",
    nit: "",
    email: "",
    phone: ""
  },
  motoValue: null,
  initialFee: 0,
  discount: 0,
  financeValue: null,
  garantia: 0,
  documentos: 0,

  // Setters básicos
  setCurrentMoto: (moto) => set({ currentMoto: moto }),
  setFinancialEntityId: (id) => set({ financialEntityId: id }),
  setQuotes: (quotes) => set({ quotes }),
  setLoading: (loading) => set({ loading }),
  setPopupVisible: (visible) => set({ popupVisible: visible }),
  setUserData: (data) => set((state) => ({
    userData: { ...state.userData, ...data }
  })),
  setErrors: (errors) => set((state) => ({
    errors: { ...state.errors, ...errors }
  })),
  setMotoValue: (value) => set({ motoValue: value }),
  setInitialFee: (value) => set({ initialFee: value }),
  setDiscount: (value) => set({ discount: value }),
  setFinanceValue: (value) => set({ financeValue: value }),
  setGarantia: (value: number) => {
    set({ garantia: value })
    const state = get()
    if (state.motoValue !== null) {
      const discountAmount = state.motoValue * (state.discount / 100)
      const valueAfterDiscount = state.motoValue - discountAmount
      const additionalCosts = value + state.documentos
      const totalValue = valueAfterDiscount + additionalCosts - state.initialFee
      state.setFinanceValue(totalValue >= 0 ? totalValue : 0)
    }
  },
  setDocumentos: (value) => set({ documentos: value }),

  // Acciones compuestas
  fetchQuotesData: async (data: Moto, financialEntityId: string) => {
    const state = get()
    set({ loading: true })
    
    try {
      const quotesResponse = await fetchQuotes(
        state.initialFee,
        state.discount,
        state.documentos,
        (state.financeValue || 0) * 100,
        state.userData.name,
        state.userData.nit,
        state.userData.email,
        state.userData.phone,
        data,
        financialEntityId
      )

      if ('error' in quotesResponse) {
        // Manejar el error aquí si es necesario
        console.error(quotesResponse.error)
        set({ quotes: [] })
      } else {
        set({ quotes: quotesResponse })
      }
    } catch (error) {
      console.error("Error fetching quotes:", error)
      set({ quotes: [] })
    } finally {
      set({ loading: false })
    }
  },

  validateField: (name: string, value: string) => {
    let errorMessage = ""

    switch (name) {
      case "name":
        if (!value){
          errorMessage = "El nombre es obligatorio."
        } else if (!/^[a-zA-Z]+$/.test(value)) {
          errorMessage = "El nombre debe contener solo letras."
        }
        break
      case "email":
        if (!value) {
          errorMessage = "El correo es obligatorio."
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "El formato de correo no es válido."
        }
        break
      case "nit":
        if (!value) {
          errorMessage = "El NIT o Cedula es obligatorio."
        } else if (!/^\d+$/.test(value)) {
          errorMessage = "la cedula o Nit deben ser dígitos."
        }
        break
      case "phone":
        if (!value) {
          errorMessage = "El teléfono es obligatorio."
        } else if (!/^\d{10}$/.test(value)) {
          errorMessage = "El teléfono debe tener 10 dígitos."
        }
        break
    }

    set((state) => ({
      errors: { ...state.errors, [name]: errorMessage }
    }))
  },

  // Implementar las funciones con debounce
  debouncedSetMotoValue: debounce((value: number | null) => {
    set({ motoValue: value })
    const state = get()
    if (value !== null && state.currentMoto) {
      state.fetchQuotesData(state.currentMoto, state.financialEntityId)
    }
  }, 2000),

  debouncedSetInitialFee: debounce((value: number) => {
    set({ initialFee: value })
    const state = get()
    if (state.currentMoto) {
      state.fetchQuotesData(state.currentMoto, state.financialEntityId)
    }
  }, 2000),

  debouncedSetDiscount: debounce((value: number) => {
    set({ discount: value })
    const state = get()
    if (state.currentMoto) {
      state.fetchQuotesData(state.currentMoto, state.financialEntityId)
    }
  }, 2000),

  debouncedSetGarantia: debounce((value: number) => {
    const state = get()
    state.setGarantia(value)
    if (state.currentMoto) {
      state.fetchQuotesData(state.currentMoto, state.financialEntityId)
    }
  }, 2000),

  debouncedSetDocumentos: debounce((value: number) => {
    set({ documentos: value })
    const state = get()
    if (state.currentMoto) {
      state.fetchQuotesData(state.currentMoto, state.financialEntityId)
    }
  }, 2000),
}))