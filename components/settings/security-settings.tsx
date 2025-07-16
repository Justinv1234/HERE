"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, KeyRound, ShieldCheck, Smartphone } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { FallbackQRCode } from "@/components/ui/qr-code"

// Dynamically import QRCode with fallback
const QRCode = dynamic(() => import("react-qr-code"), {
  ssr: false,
  loading: () => <FallbackQRCode value="" size={200} />,
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function SecuritySettings() {
  const { toast } = useToast()
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [is2FALoading, setIs2FALoading] = useState(false)
  const [showSetup2FA, setShowSetup2FA] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [totpSecret, setTotpSecret] = useState("")
  const [totpUri, setTotpUri] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")
  const [dbInitialized, setDbInitialized] = useState(false)
  const [dbInitializing, setDbInitializing] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)
  const [sessionsList, setSessionsList] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, USA",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "2",
      device: "Safari on macOS",
      location: "San Francisco, USA",
      lastActive: "2 days ago",
      current: false,
    },
    {
      id: "3",
      device: "Firefox on Ubuntu",
      location: "Toronto, Canada",
      lastActive: "1 week ago",
      current: false,
    },
  ])
  const [qrError, setQrError] = useState(false)

  // This would come from your API or auth provider
  const defaultValues: Partial<PasswordFormValues> = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Initialize the database on component mount
  useEffect(() => {
    const initializeDb = async () => {
      try {
        setDbInitializing(true)
        setDbError(null)

        const response = await fetch("/api/admin/init-db")
        const data = await response.json()

        if (data.success) {
          setDbInitialized(true)
          console.log("Database initialized successfully")
        } else {
          console.error("Failed to initialize database:", data.message)
          setDbError(data.message || "Failed to initialize database")

          // If we're using mock DB, we can still proceed
          if (data.usingMock) {
            setDbInitialized(true)
            toast({
              title: "Using mock database",
              description: "The application is using a mock database for demonstration purposes.",
              duration: 5000,
            })
          }
        }
      } catch (error) {
        console.error("Error initializing database:", error)
        setDbError("Failed to connect to the database. Using mock database for demonstration.")
        setDbInitialized(true)
      } finally {
        setDbInitializing(false)
      }
    }

    initializeDb()
  }, [toast])

  // Check if 2FA is enabled on component mount
  useEffect(() => {
    const check2FAStatus = async () => {
      if (!dbInitialized) return

      try {
        const response = await fetch("/api/user/two-factor/status")
        const data = await response.json()

        if (data.enabled) {
          setIs2FAEnabled(true)
        }
      } catch (error) {
        console.error("Error checking 2FA status:", error)
      }
    }

    if (dbInitialized) {
      check2FAStatus()
    }
  }, [dbInitialized])

  async function onSubmit(data: PasswordFormValues) {
    setIsPasswordLoading(true)

    try {
      // In a real app, you would update the password via an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      form.reset(defaultValues)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your password was not updated. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    if (!dbInitialized) {
      toast({
        title: "Database not initialized",
        description: "Please wait while we set up the database.",
        variant: "destructive",
      })
      return
    }

    if (is2FAEnabled) {
      // Disable 2FA
      setIs2FALoading(true)

      try {
        const response = await fetch("/api/user/two-factor", {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to disable 2FA")
        }

        setIs2FAEnabled(false)
        setShowSetup2FA(false)

        toast({
          title: "2FA disabled",
          description: "Two-factor authentication has been disabled successfully.",
        })
      } catch (error) {
        toast({
          title: "Something went wrong",
          description: "Failed to disable two-factor authentication. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIs2FALoading(false)
      }
    } else {
      // Start 2FA setup
      setIs2FALoading(true)

      try {
        const response = await fetch("/api/user/two-factor")

        if (!response.ok) {
          throw new Error("Failed to start 2FA setup")
        }

        const data = await response.json()

        setTotpSecret(data.secret)
        setTotpUri(data.uri)
        setUserEmail(data.email)
        setShowSetup2FA(true)
        setActiveTab("setup")
      } catch (error) {
        toast({
          title: "Something went wrong",
          description: "Failed to start two-factor authentication setup. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIs2FALoading(false)
      }
    }
  }

  const handleSetup2FA = async () => {
    if (!dbInitialized) {
      toast({
        title: "Database not initialized",
        description: "Please wait while we set up the database.",
        variant: "destructive",
      })
      return
    }

    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      })
      return
    }

    setIs2FALoading(true)

    try {
      const response = await fetch("/api/user/two-factor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: verificationCode,
          secret: totpSecret,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to verify code")
      }

      const data = await response.json()

      setIs2FAEnabled(true)
      setBackupCodes(data.backupCodes)
      setShowBackupCodes(true)
      setActiveTab("backup")
      setVerificationCode("")

      toast({
        title: "2FA enabled",
        description: "Two-factor authentication has been enabled successfully.",
      })
    } catch (error) {
      console.error("Error setting up 2FA:", error)
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Failed to verify code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIs2FALoading(false)
    }
  }

  const handleFinishSetup = () => {
    setShowSetup2FA(false)
    setShowBackupCodes(false)
  }

  const handleRevokeSession = async (sessionId: string) => {
    // Show loading state
    const loadingToast = toast({
      title: "Revoking session...",
      description: "The selected session is being revoked.",
    })

    try {
      // In a real app, you would revoke the session via an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Remove the session from the list
      setSessionsList(sessionsList.filter((session) => session.id !== sessionId))

      // Update the toast with success message
      toast({
        id: loadingToast.id,
        title: "Session revoked",
        description: "The selected session has been revoked successfully.",
      })
    } catch (error) {
      toast({
        id: loadingToast.id,
        title: "Something went wrong",
        description: "Failed to revoke session. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRevokeAllSessions = async () => {
    // Show loading state
    const loadingToast = toast({
      title: "Revoking all sessions...",
      description: "All other sessions are being revoked.",
    })

    try {
      // In a real app, you would revoke all sessions via an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Keep only the current session
      setSessionsList(sessionsList.filter((session) => session.current))

      // Update the toast with success message
      toast({
        id: loadingToast.id,
        title: "All sessions revoked",
        description: "All other sessions have been revoked successfully.",
      })
    } catch (error) {
      toast({
        id: loadingToast.id,
        title: "Something went wrong",
        description: "Failed to revoke all sessions. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Extract secret key from URI for manual entry
  const extractSecret = (uri: string) => {
    try {
      const match = uri.match(/secret=([A-Z0-9]+)&/i)
      return match ? match[1] : null
    } catch (error) {
      return null
    }
  }

  const secretKey = totpUri ? extractSecret(totpUri) : null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">Manage your account security and authentication methods.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>Password must be at least 8 characters long.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            </div>
            <CardDescription>
              Add an extra layer of security to your account by requiring a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dbInitializing ? (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Setting up database...</p>
                </div>
              </div>
            ) : dbError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Error</AlertTitle>
                <AlertDescription>{dbError}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="text-base font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      {is2FAEnabled
                        ? "Your account is protected with two-factor authentication."
                        : "Protect your account with two-factor authentication."}
                    </div>
                  </div>
                  <Switch
                    checked={is2FAEnabled}
                    onCheckedChange={handleToggle2FA}
                    disabled={is2FALoading || showSetup2FA}
                  />
                </div>

                {showSetup2FA && (
                  <div className="mt-6 space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="setup" disabled={showBackupCodes}>
                          Setup
                        </TabsTrigger>
                        <TabsTrigger value="backup" disabled={!showBackupCodes}>
                          Backup Codes
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="setup" className="space-y-4 mt-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Setup Instructions</AlertTitle>
                          <AlertDescription>
                            <ol className="list-decimal pl-4 space-y-2 mt-2">
                              <li>Download an authenticator app like Google Authenticator or Authy.</li>
                              <li>Scan the QR code below with your authenticator app.</li>
                              <li>Enter the 6-digit verification code from your app below.</li>
                            </ol>
                          </AlertDescription>
                        </Alert>

                        <div className="flex justify-center py-4">
                          <div className="bg-white p-4 rounded-lg">
                            {totpUri && (
                              <>
                                {qrError ? (
                                  <FallbackQRCode value={totpUri} size={200} />
                                ) : (
                                  <div className="relative">
                                    <QRCode
                                      value={totpUri}
                                      style={{ width: "200px", height: "200px" }}
                                      onError={() => setQrError(true)}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {secretKey && (
                          <div className="mt-2 text-center">
                            <p className="text-sm text-muted-foreground">
                              If you can't scan the QR code, enter this key manually:
                            </p>
                            <p className="font-mono text-sm mt-1 bg-muted p-2 rounded">{secretKey}</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label htmlFor="verification-code" className="text-sm font-medium">
                            Verification Code
                          </label>
                          <Input
                            id="verification-code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            maxLength={6}
                            className="font-mono text-center text-lg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the 6-digit code from your authenticator app.
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <Button onClick={handleSetup2FA} disabled={is2FALoading || verificationCode.length !== 6}>
                            {is2FALoading ? "Verifying..." : "Verify & Enable 2FA"}
                          </Button>
                          <Button variant="outline" onClick={() => setShowSetup2FA(false)} disabled={is2FALoading}>
                            Cancel
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="backup" className="space-y-4 mt-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Backup Codes</AlertTitle>
                          <AlertDescription>
                            <p className="mt-2">
                              Save these backup codes in a secure place. You can use them to sign in if you lose access
                              to your authenticator app.
                            </p>
                            <p className="mt-1">Each code can only be used once.</p>
                          </AlertDescription>
                        </Alert>

                        <div className="bg-muted p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-2">
                            {backupCodes.map((code, index) => (
                              <div key={index} className="font-mono text-center p-2 border rounded bg-background">
                                {code}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(backupCodes.join("\n"))
                              toast({
                                title: "Copied to clipboard",
                                description: "Backup codes have been copied to your clipboard.",
                              })
                            }}
                          >
                            Copy Codes
                          </Button>
                          <Button variant="outline" onClick={handleFinishSetup}>
                            I've Saved My Codes
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Active Sessions</CardTitle>
            </div>
            <CardDescription>Manage your active sessions across different devices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionsList.map((session) => (
                <div key={session.id} className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="text-base font-medium flex items-center gap-2">
                      {session.device}
                      {session.current && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.location} • Last active: {session.lastActive}
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {sessionsList.filter((session) => !session.current).length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={handleRevokeAllSessions}>
                  Revoke All Other Sessions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
