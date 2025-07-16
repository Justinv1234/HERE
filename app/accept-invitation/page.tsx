import { redirect } from "next/navigation"
import { getUserByInvitationToken } from "@/lib/db"
import AcceptInvitationForm from "./accept-invitation-form"

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const { token } = searchParams

  if (!token) {
    redirect("/login?error=Invalid+or+missing+invitation+token")
  }

  // Check if token is valid
  const user = await getUserByInvitationToken(token)

  if (!user) {
    redirect("/login?error=Invalid+or+expired+invitation+token")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">TaskFlow</h1>
          <p className="text-gray-400 mt-2">Complete your account setup</p>
        </div>
        <AcceptInvitationForm email={user.email} token={token} />
      </div>
    </div>
  )
}
