"use client"

import * as React from "react"
import { Toast } from "@/components/ui/toast"

interface ToastOptions {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
}

interface ToastContextType {
  toast: (options: ToastOptions) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function UseToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastOptions & { id: string }>>([])

  const toast = React.useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...options, id }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.map((toastItem) => (
        <Toast
          key={toastItem.id}
          title={toastItem.title}
          description={toastItem.description}
          variant={toastItem.variant}
          onClose={() => removeToast(toastItem.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
