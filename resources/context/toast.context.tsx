import { createContext, useCallback, useMemo, useState } from 'react'
import { ToastProps } from '../components/toast'

interface ToastContextType {
  showToast: ({ type, message }: ToastProps) => void
  hideToast: () => void
  toast: ToastProps | null
}

export const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = useCallback(({ type, message, duration }: ToastProps) => {
    setToast({ type, message, duration })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
      toast
    }),
    [showToast, hideToast, toast]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
