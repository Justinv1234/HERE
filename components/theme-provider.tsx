"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type FontSize = "sm" | "md" | "lg"
type ColorScheme = "default" | "blue" | "green" | "purple" | "orange"

type AppearanceSettings = {
  theme: Theme
  fontSize: FontSize
  colorScheme: ColorScheme
}

type AppearanceProviderProps = {
  children: React.ReactNode
  defaultSettings?: Partial<AppearanceSettings>
}

type AppearanceProviderState = AppearanceSettings & {
  setTheme: (theme: Theme) => void
  setFontSize: (fontSize: FontSize) => void
  setColorScheme: (colorScheme: ColorScheme) => void
  setAppearance: (settings: Partial<AppearanceSettings>) => void
}

const defaultAppearanceSettings: AppearanceSettings = {
  theme: "dark",
  fontSize: "md",
  colorScheme: "default",
}

const AppearanceProviderContext = createContext<AppearanceProviderState>({
  ...defaultAppearanceSettings,
  setTheme: () => null,
  setFontSize: () => null,
  setColorScheme: () => null,
  setAppearance: () => null,
})

export function ThemeProvider({ children, defaultSettings = {}, ...props }: AppearanceProviderProps) {
  const [settings, setSettings] = useState<AppearanceSettings>({
    ...defaultAppearanceSettings,
    ...defaultSettings,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appearance-settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings((current) => ({
          ...current,
          ...parsedSettings,
        }))
      } catch (error) {
        console.error("Failed to parse saved appearance settings", error)
      }
    }
  }, [])

  // Apply theme
  useEffect(() => {
    const root = document.documentElement
    const isDark =
      settings.theme === "dark" ||
      (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [settings.theme])

  // Apply font size
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--font-size-multiplier", getFontSizeMultiplier(settings.fontSize))
  }, [settings.fontSize])

  // Apply color scheme
  useEffect(() => {
    const root = document.documentElement

    // Reset previous color scheme classes
    root.classList.remove("theme-default", "theme-blue", "theme-green", "theme-purple", "theme-orange")

    // Add new color scheme class
    root.classList.add(`theme-${settings.colorScheme}`)

    // Apply color scheme variables
    applyColorScheme(settings.colorScheme)
  }, [settings.colorScheme])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("appearance-settings", JSON.stringify(settings))
  }, [settings])

  const value = {
    ...settings,
    setTheme: (theme: Theme) => {
      setSettings((current) => ({ ...current, theme }))
    },
    setFontSize: (fontSize: FontSize) => {
      setSettings((current) => ({ ...current, fontSize }))
    },
    setColorScheme: (colorScheme: ColorScheme) => {
      setSettings((current) => ({ ...current, colorScheme }))
    },
    setAppearance: (newSettings: Partial<AppearanceSettings>) => {
      setSettings((current) => ({ ...current, ...newSettings }))
    },
  }

  return (
    <AppearanceProviderContext.Provider {...props} value={value}>
      {children}
    </AppearanceProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(AppearanceProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

// Helper functions
function getFontSizeMultiplier(fontSize: FontSize): string {
  switch (fontSize) {
    case "sm":
      return "0.875"
    case "md":
      return "1"
    case "lg":
      return "1.125"
    default:
      return "1"
  }
}

function applyColorScheme(colorScheme: ColorScheme) {
  const root = document.documentElement

  // Reset to default colors
  if (colorScheme === "default") {
    root.style.removeProperty("--primary")
    root.style.removeProperty("--primary-foreground")
    root.style.removeProperty("--secondary")
    root.style.removeProperty("--accent")
    return
  }

  // Apply color scheme variables
  const colorMap = {
    blue: {
      primary: "210 100% 50%",
      secondary: "210 50% 40%",
      accent: "210 100% 35%",
    },
    green: {
      primary: "142 76% 36%",
      secondary: "142 50% 30%",
      accent: "142 70% 25%",
    },
    purple: {
      primary: "270 80% 50%",
      secondary: "270 50% 40%",
      accent: "270 70% 35%",
    },
    orange: {
      primary: "24 95% 53%",
      secondary: "24 70% 45%",
      accent: "24 90% 40%",
    },
  }

  const colors = colorMap[colorScheme]
  if (colors) {
    root.style.setProperty("--primary", colors.primary)
    root.style.setProperty("--primary-foreground", "0 0% 100%")
    root.style.setProperty("--secondary", colors.secondary)
    root.style.setProperty("--accent", colors.accent)
  }
}
