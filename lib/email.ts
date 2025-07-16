import { createTransport } from "nodemailer"

// Configure email transport
const transport = process.env.SMTP_HOST
  ? createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null

// Check if email is configured
export function isEmailConfigured(): boolean {
  return !!transport
}

// Send an email
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}): Promise<boolean> {
  if (!transport) {
    console.warn("Email transport not configured. Email not sent.")
    return false
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || "noreply@taskflow.com",
      to,
      subject,
      html,
      text,
    })
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Send an invitation email
export async function sendInvitationEmail({
  email,
  token,
  businessName,
  invitedBy,
}: {
  email: string
  token: string
  businessName: string
  invitedBy: string
}): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const invitationUrl = `${baseUrl}/accept-invitation?token=${token}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">You've been invited to join ${businessName} on TaskFlow</h2>
      <p>${invitedBy} has invited you to collaborate on TaskFlow.</p>
      <p>TaskFlow is a project management and time tracking tool that helps teams work more efficiently.</p>
      <div style="margin: 30px 0;">
        <a href="${invitationUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a>
      </div>
      <p>This invitation will expire in 7 days.</p>
      <p>If you have any questions, please contact the person who invited you.</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="color: #666; font-size: 12px;">If you didn't expect this invitation, you can ignore this email.</p>
    </div>
  `

  const text = `
    You've been invited to join ${businessName} on TaskFlow
    
    ${invitedBy} has invited you to collaborate on TaskFlow.
    
    TaskFlow is a project management and time tracking tool that helps teams work more efficiently.
    
    Accept the invitation by visiting this link:
    ${invitationUrl}
    
    This invitation will expire in 7 days.
    
    If you have any questions, please contact the person who invited you.
    
    If you didn't expect this invitation, you can ignore this email.
  `

  return sendEmail({
    to: email,
    subject: `Invitation to join ${businessName} on TaskFlow`,
    html,
    text,
  })
}
