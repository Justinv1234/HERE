import { GetStartedForm } from "@/components/auth/get-started-form"

export default function GetStartedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Get Started with TaskFlow</h1>
          <p className="text-gray-400 text-lg">Create your account and start managing projects efficiently</p>
        </div>
        <GetStartedForm />
      </div>
    </div>
  )
}
