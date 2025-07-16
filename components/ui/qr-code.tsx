"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
  level?: string
  style?: React.CSSProperties
}

export function FallbackQRCode({ value, size = 200, bgColor = "#FFFFFF", fgColor = "#000000", style }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Draw a placeholder QR code-like pattern
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Draw a border
    ctx.fillStyle = fgColor
    ctx.fillRect(0, 0, size, 10) // Top
    ctx.fillRect(0, 0, 10, size) // Left
    ctx.fillRect(size - 10, 0, 10, size) // Right
    ctx.fillRect(0, size - 10, size, 10) // Bottom

    // Draw corner squares
    const cornerSize = 40
    const margin = 20

    // Top-left corner
    ctx.fillRect(margin, margin, cornerSize, cornerSize)
    // Top-right corner
    ctx.fillRect(size - margin - cornerSize, margin, cornerSize, cornerSize)
    // Bottom-left corner
    ctx.fillRect(margin, size - margin - cornerSize, cornerSize, cornerSize)

    // Draw inner squares
    ctx.fillRect(margin + 10, margin + 10, cornerSize - 20, cornerSize - 20)
    ctx.fillRect(size - margin - cornerSize + 10, margin + 10, cornerSize - 20, cornerSize - 20)
    ctx.fillRect(margin + 10, size - margin - cornerSize + 10, cornerSize - 20, cornerSize - 20)

    // Draw some random dots to make it look like a QR code
    const dotSize = 10
    const gridSize = Math.floor((size - 2 * margin) / dotSize)

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Skip the corners
        if (
          (i < 4 && j < 4) || // Top-left
          (i < 4 && j > gridSize - 5) || // Top-right
          (i > gridSize - 5 && j < 4) // Bottom-left
        ) {
          continue
        }

        // Randomly draw dots
        if (Math.random() > 0.7) {
          ctx.fillRect(margin + i * dotSize, margin + j * dotSize, dotSize, dotSize)
        }
      }
    }

    // Draw text to indicate this is a placeholder
    ctx.fillStyle = fgColor
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Scan with authenticator app", size / 2, size / 2)
    ctx.fillText("or enter secret manually:", size / 2, size / 2 + 20)

    // Display a portion of the value as a secret key
    if (value && value.length > 20) {
      const secretPart = value.substring(value.length - 16)
      ctx.font = "bold 14px monospace"
      ctx.fillText(secretPart, size / 2, size / 2 + 50)
    }
  }, [value, size, bgColor, fgColor])

  return <canvas ref={canvasRef} width={size} height={size} style={{ ...style, maxWidth: "100%", height: "auto" }} />
}
