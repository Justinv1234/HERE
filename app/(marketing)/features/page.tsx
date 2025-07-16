import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Features | TaskFlow",
  description: "Discover the powerful features of TaskFlow for project management and time tracking.",
}

export default function FeaturesPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Powerful Features for Teams</h1>
        <p className="mt-6 text-xl text-gray-400">
          TaskFlow provides everything you need to manage projects, track time, and collaborate with your team.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur">
            <div className="mb-4 text-blue-500">{feature.icon}</div>
            <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-4 px-6 text-left">Feature</th>
                <th className="py-4 px-6 text-center">Free</th>
                <th className="py-4 px-6 text-center">Pro</th>
                <th className="py-4 px-6 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={index !== comparisonFeatures.length - 1 ? "border-b border-gray-800" : ""}
                >
                  <td className="py-4 px-6">{feature.name}</td>
                  <td className="py-4 px-6 text-center">
                    {feature.free ? (
                      <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {feature.pro ? (
                      <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {feature.enterprise ? (
                      <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="mt-4 text-xl text-gray-400">
          Join thousands of teams already using TaskFlow to improve productivity.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">Sign Up for Free</Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Project Management",
    description: "Create and manage projects with tasks, deadlines, and assignments to keep your team organized.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    title: "Time Tracking",
    description: "Track time spent on tasks and projects with a simple start/stop timer or manual time entries.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Team Collaboration",
    description: "Invite team members, assign tasks, and collaborate in real-time on projects.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Reporting & Analytics",
    description: "Generate detailed reports on time spent, project progress, and team performance.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Invoice Management",
    description: "Organize and manage your invoices with secure document storage and client payment tracking.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Customizable Workflows",
    description: "Create custom workflows that match your team's unique processes and requirements.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
  },
]

const comparisonFeatures = [
  { name: "Project Management", free: true, pro: true, enterprise: true },
  { name: "Time Tracking", free: true, pro: true, enterprise: true },
  { name: "Team Members", free: "Up to 3", pro: "Up to 10", enterprise: "Unlimited" },
  { name: "Reports", free: "Basic", pro: "Advanced", enterprise: "Custom" },
  { name: "Invoice Management", free: false, pro: true, enterprise: true },
  { name: "Priority Support", free: false, pro: true, enterprise: true },
  { name: "Custom Branding", free: false, pro: false, enterprise: true },
  { name: "SSO Integration", free: false, pro: false, enterprise: true },
  { name: "Dedicated Account Manager", free: false, pro: false, enterprise: true },
]
