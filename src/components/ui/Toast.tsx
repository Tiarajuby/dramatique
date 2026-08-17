'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: string; message: string; type: ToastType }
interface ToastContextType { showToast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = (id: string) => setToasts(p => p.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[300] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map(toast => (
          <div key={toast.id} className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-xl px-4 py-3 shadow-2xl animate-slide-up">
            {toast.type === 'success' && <CheckCircle size={18} className="text-green-400 flex-shrink-0" />}
            {toast.type === 'error'   && <AlertCircle size={18} className="text-brand-red flex-shrink-0" />}
            {toast.type === 'info'    && <Info size={18} className="text-blue-400 flex-shrink-0" />}
            <p className="text-white text-sm flex-1">{toast.message}</p>
            <button onClick={() => remove(toast.id)} className="text-brand-subtle hover:text-white flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
