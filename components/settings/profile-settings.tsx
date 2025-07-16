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
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileSettings() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || "")

  // This would come from your API or auth provider
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    jobTitle: user?.jobTitle || "",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    // Show loading state
    const loadingToast = toast({
      title: "Updating profile...",
      description: "Your profile information is being updated.",
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the toast with success message
    toast({
      id: loadingToast.id,
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      variant: "success",
    })

    // In a real app, you would update the user profile via an API call
    console.log("Profile data submitted:", data)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file)
    setAvatarSrc(previewUrl)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would upload the file to your server or a storage service
    // const formData = new FormData()
    // formData.append("avatar", file)
    // const response = await fetch("/api/upload-avatar", { method: "POST", body: formData })
    // const data = await response.json()
    // setAvatarSrc(data.avatarUrl)

    setIsUploading(false)
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated successfully.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site. You can edit your profile information here.
        </p>
      </div>
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={user?.name || "User"} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="relative" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Change avatar"}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </Button>
          <Button variant="link" className="px-0" onClick={() => setAvatarSrc("")}>
            Remove avatar
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  This email will be used for important notifications and communications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Your job title" {...field} />
                </FormControl>
                <FormDescription>Your role or position within your organization.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Brief description for your profile. URLs are hyperlinked.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(defaultValues)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
