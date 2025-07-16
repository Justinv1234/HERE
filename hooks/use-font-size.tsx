"use client"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function useFontSize() {
  const { fontSize } = useTheme()

  const getFontSizeClass = (baseClass = "") => {
    const fontSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    }

    return cn(baseClass, fontSizeClasses[fontSize as keyof typeof fontSizeClasses])
  }

  return { getFontSizeClass }
}
