"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
  fontSize: z.enum(["sm", "md", "lg"], {
    required_error: "Please select a font size.",
  }),
  colorScheme: z.enum(["default", "blue", "green", "purple", "orange"], {
    required_error: "Please select a color scheme.",
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceSettings() {
  const { toast } = useToast()
  const { theme, fontSize, colorScheme, setAppearance } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use the current theme settings as default values
  const defaultValues: AppearanceFormValues = {
    theme: theme as "light" | "dark" | "system",
    fontSize: fontSize as "sm" | "md" | "lg",
    colorScheme: colorScheme as "default" | "blue" | "green" | "purple" | "orange",
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AppearanceFormValues) {
    setIsSubmitting(true)

    try {
      // Apply the new appearance settings
      setAppearance(data)

      // Simulate API call to save settings to user profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Appearance updated",
        description: "Your appearance settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your appearance settings were not updated. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const colorSchemes = [
    { value: "default", label: "Default", bgClass: "bg-primary" },
    { value: "blue", label: "Blue", bgClass: "bg-blue-600" },
    { value: "green", label: "Green", bgClass: "bg-green-600" },
    { value: "purple", label: "Purple", bgClass: "bg-purple-600" },
    { value: "orange", label: "Orange", bgClass: "bg-orange-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">Customize the appearance of the application.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Theme</FormLabel>
                <FormDescription>Select the theme for the dashboard.</FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid max-w-md grid-cols-3 gap-8 pt-2"
                >
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="light" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">Light</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="dark" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                        <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                          <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">Dark</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="system" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                        <div className="space-y-2 rounded-sm bg-gradient-to-r from-[#ecedef] to-slate-950 p-2">
                          <div className="space-y-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#ecedef] to-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#ecedef] to-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">System</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fontSize"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Font Size</FormLabel>
                <FormDescription>Select the font size for the dashboard.</FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid max-w-md grid-cols-3 gap-8 pt-2"
                >
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="sm" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent">
                        <span className="text-sm">Small</span>
                      </div>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="md" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent">
                        <span className="text-base">Medium</span>
                      </div>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="lg" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent">
                        <span className="text-lg">Large</span>
                      </div>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="colorScheme"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Color Scheme</FormLabel>
                <FormDescription>Select the color scheme for the dashboard.</FormDescription>
                <FormMessage />
                <div className="grid max-w-md grid-cols-5 gap-4 pt-2">
                  {colorSchemes.map((scheme) => (
                    <Card
                      key={scheme.value}
                      className={`cursor-pointer transition-all ${
                        field.value === scheme.value ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => form.setValue("colorScheme", scheme.value as any)}
                    >
                      <CardContent className="p-4 flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${scheme.bgClass} flex items-center justify-center`}>
                          {field.value === scheme.value && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <span className="text-xs font-medium">{scheme.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset({
                  theme: "dark",
                  fontSize: "md",
                  colorScheme: "default",
                })
                setAppearance({
                  theme: "dark",
                  fontSize: "md",
                  colorScheme: "default",
                })
              }}
              disabled={isSubmitting}
            >
              Reset to defaults
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
