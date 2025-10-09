import { ToastContext } from '@/resources/context/toast.context'
import { useContext } from 'react'

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast hook must be used within a <ToastProvider />')
  }

  return context
}
