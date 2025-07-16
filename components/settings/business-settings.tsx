"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const businessFormSchema = z.object({
  name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zip: z.string().min(5, {
    message: "ZIP code must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  description: z
    .string()
    .max(500, {
      message: "Description must not be longer than 500 characters.",
    })
    .optional(),
})

type BusinessFormValues = z.infer<typeof businessFormSchema>

const billingFormSchema = z.object({
  billingName: z.string().min(2, {
    message: "Billing name must be at least 2 characters.",
  }),
  billingEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  billingAddress: z.string().min(5, {
    message: "Billing address must be at least 5 characters.",
  }),
  billingCity: z.string().min(2, {
    message: "Billing city must be at least 2 characters.",
  }),
  billingState: z.string().min(2, {
    message: "Billing state must be at least 2 characters.",
  }),
  billingZip: z.string().min(5, {
    message: "Billing ZIP code must be at least 5 characters.",
  }),
  billingCountry: z.string().min(2, {
    message: "Billing country must be at least 2 characters.",
  }),
  taxId: z.string().optional(),
})

type BillingFormValues = z.infer<typeof billingFormSchema>

export function BusinessSettings() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [logoSrc, setLogoSrc] = useState("/generic-company-logo.png")
  const [activeTab, setActiveTab] = useState("general")

  // This would come from your API or auth provider
  const defaultBusinessValues: Partial<BusinessFormValues> = {
    name: "Acme Inc.",
    email: "info@acmeinc.com",
    phone: "555-123-4567",
    website: "https://acmeinc.com",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
    industry: "technology",
    description: "Acme Inc. is a leading provider of innovative solutions for businesses of all sizes.",
  }

  const defaultBillingValues: Partial<BillingFormValues> = {
    billingName: "Acme Inc.",
    billingEmail: "billing@acmeinc.com",
    billingAddress: "123 Main St",
    billingCity: "San Francisco",
    billingState: "CA",
    billingZip: "94105",
    billingCountry: "United States",
    taxId: "12-3456789",
  }

  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: defaultBusinessValues,
    mode: "onChange",
  })

  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: defaultBillingValues,
    mode: "onChange",
  })

  async function onBusinessSubmit(data: BusinessFormValues) {
    // Show loading state
    const loadingToast = toast({
      title: "Updating business information...",
      description: "Your business information is being updated.",
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the toast with success message
    toast({
      id: loadingToast.id,
      title: "Business information updated",
      description: "Your business information has been updated successfully.",
      variant: "success",
    })

    // In a real app, you would update the business information via an API call
    console.log("Business information submitted:", data)
  }

  async function onBillingSubmit(data: BillingFormValues) {
    // Show loading state
    const loadingToast = toast({
      title: "Updating billing information...",
      description: "Your billing information is being updated.",
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the toast with success message
    toast({
      id: loadingToast.id,
      title: "Billing information updated",
      description: "Your billing information has been updated successfully.",
      variant: "success",
    })

    // In a real app, you would update the billing information via an API call
    console.log("Billing information submitted:", data)
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file)
    setLogoSrc(previewUrl)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would upload the file to your server or a storage service
    // const formData = new FormData()
    // formData.append("logo", file)
    // const response = await fetch("/api/upload-logo", { method: "POST", body: formData })
    // const data = await response.json()
    // setLogoSrc(data.logoUrl)

    setIsUploading(false)
    toast({
      title: "Logo updated",
      description: "Your business logo has been updated successfully.",
      variant: "success",
    })
  }

  const handleCopyBillingInfo = () => {
    billingForm.setValue("billingName", businessForm.getValues("name"))
    billingForm.setValue("billingEmail", businessForm.getValues("email"))
    billingForm.setValue("billingAddress", businessForm.getValues("address"))
    billingForm.setValue("billingCity", businessForm.getValues("city"))
    billingForm.setValue("billingState", businessForm.getValues("state"))
    billingForm.setValue("billingZip", businessForm.getValues("zip"))
    billingForm.setValue("billingCountry", businessForm.getValues("country"))

    toast({
      title: "Billing information copied",
      description: "Your business information has been copied to billing information.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Business Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your business information and billing details.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={logoSrc || "/placeholder.svg"} alt="Business Logo" />
                  <AvatarFallback>{defaultBusinessValues.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="relative" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Change logo"}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploading}
                    />
                  </Button>
                  <Button variant="link" className="px-0" onClick={() => setLogoSrc("")}>
                    Remove logo
                  </Button>
                </div>
              </div>

              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={businessForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="555-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                      <FormField
                        control={businessForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of your business"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Briefly describe your business in 500 characters or less.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP / Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="94105" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={businessForm.formState.isSubmitting}>
                      {businessForm.formState.isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => businessForm.reset(defaultBusinessValues)}
                      disabled={businessForm.formState.isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Update your billing details for invoices and payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-6">
                <Button variant="outline" size="sm" onClick={handleCopyBillingInfo}>
                  Copy from Business Info
                </Button>
              </div>

              <Form {...billingForm}>
                <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={billingForm.control}
                      name="billingName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Billing name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={billingForm.control}
                      name="billingEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Email</FormLabel>
                          <FormControl>
                            <Input placeholder="billing@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={billingForm.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID / VAT Number</FormLabel>
                          <FormControl>
                            <Input placeholder="12-3456789" {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional: Enter your tax identification number if applicable.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Billing Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={billingForm.control}
                        name="billingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={billingForm.control}
                        name="billingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={billingForm.control}
                        name="billingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={billingForm.control}
                        name="billingZip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP / Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="94105" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={billingForm.control}
                        name="billingCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={billingForm.formState.isSubmitting}>
                      {billingForm.formState.isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => billingForm.reset(defaultBillingValues)}
                      disabled={billingForm.formState.isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
