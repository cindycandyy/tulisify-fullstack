"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  onClose?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement

export function Toast({ title, description, variant = "default", onClose, open = true, onOpenChange }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(open)

  React.useEffect(() => {
    setIsVisible(open)
  }, [open])

  React.useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onOpenChange?.(false)
      onClose?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [isVisible, onClose, onOpenChange])

  if (!isVisible) return null

  const variantStyles = {
    default: "bg-white border-gray-200 text-gray-900",
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
  }

  const iconStyles = {
    default: "text-blue-500",
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 rounded-lg border p-4 shadow-lg transition-all duration-300",
        variantStyles[variant],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", iconStyles[variant])}>
          {variant === "success" && "✓"}
          {variant === "error" && "✕"}
          {variant === "warning" && "⚠"}
          {variant === "default" && "ℹ"}
        </div>
        <div className="flex-1">
          {title && <div className="font-medium text-sm">{title}</div>}
          {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onOpenChange?.(false)
            onClose?.()
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
