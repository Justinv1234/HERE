"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"

export function AppearanceDemo() {
  const { theme, fontSize, colorScheme } = useTheme()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appearance Preview</CardTitle>
          <CardDescription>This card demonstrates your current appearance settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Current Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md border p-4">
                <div className="text-sm font-medium">Theme</div>
                <div className="mt-1 font-mono">{theme}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm font-medium">Font Size</div>
                <div className="mt-1 font-mono">{fontSize}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm font-medium">Color Scheme</div>
                <div className="mt-1 font-mono">{colorScheme}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Text Samples</h3>
            <p className="text-dynamic-xs">This is extra small text (xs)</p>
            <p className="text-dynamic-sm">This is small text (sm)</p>
            <p className="text-dynamic-base">This is base text (base)</p>
            <p className="text-dynamic-lg">This is large text (lg)</p>
            <p className="text-dynamic-xl">This is extra large text (xl)</p>
            <p className="text-dynamic-2xl">This is 2xl text (2xl)</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">UI Elements</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Changes to appearance settings are applied immediately.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
