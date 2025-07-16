import * as React from "react"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Pricing | TaskFlow",
  description: "Simple, transparent pricing for teams of all sizes.",
}

export default function PricingPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Simple, Transparent Pricing</h1>
        <p className="mt-6 text-xl text-gray-400">
          Choose the plan that's right for your team. Start building better projects today.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className="flex flex-col border-gray-800 bg-black/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-400"> /month</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={plan.href} className="w-full">
                <Button variant={plan.featured ? "default" : "outline"} className="w-full" size="lg">
                  {plan.buttonText}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Compare Plans</h2>
        <div className="mx-auto max-w-6xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-4 text-left font-medium">Features</th>
                  <th className="py-4 text-center font-medium">Freelancer</th>
                  <th className="py-4 text-center font-medium">Team</th>
                  <th className="py-4 text-center font-medium">Business</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr className="border-b border-gray-800/50">
                      <td colSpan={4} className="py-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-gray-800/30">
                        <td className="py-3 text-sm">{feature.name}</td>
                        <td className="py-3 text-center">
                          {feature.freelancer === true ? (
                            <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                          ) : feature.freelancer === false ? (
                            <span className="text-gray-500">—</span>
                          ) : (
                            <span className="text-sm text-gray-400">{feature.freelancer}</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {feature.team === true ? (
                            <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                          ) : feature.team === false ? (
                            <span className="text-gray-500">—</span>
                          ) : (
                            <span className="text-sm text-gray-400">{feature.team}</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {feature.business === true ? (
                            <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                          ) : feature.business === false ? (
                            <span className="text-gray-500">—</span>
                          ) : (
                            <span className="text-sm text-gray-400">{feature.business}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="mx-auto max-w-3xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <p className="mt-2 text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-xl border border-gray-800 bg-black/50 p-8 text-center backdrop-blur">
        <h2 className="text-2xl font-bold">Need a custom plan?</h2>
        <p className="mt-2 text-gray-400">
          Contact our sales team for custom pricing options for larger teams or specific requirements.
        </p>
        <Link href="/contact" className="mt-6 inline-block">
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </Link>
      </div>
    </div>
  )
}

const featureComparison = [
  {
    category: "Users & Access",
    features: [
      { name: "User accounts", freelancer: "1 user", team: "Up to 10 users", business: "Unlimited users" },
      { name: "Admin controls", freelancer: false, team: true, business: true },
      { name: "Role-based permissions", freelancer: false, team: true, business: true },
      { name: "SSO integration", freelancer: false, team: false, business: true },
      { name: "Custom branding", freelancer: false, team: false, business: true },
    ],
  },
  {
    category: "Project Management",
    features: [
      { name: "Unlimited projects", freelancer: true, team: true, business: true },
      { name: "Task management", freelancer: true, team: true, business: true },
      { name: "Project templates", freelancer: true, team: true, business: true },
      { name: "Kanban boards", freelancer: true, team: true, business: true },
      { name: "Gantt charts", freelancer: false, team: true, business: true },
      { name: "Project dependencies", freelancer: false, team: true, business: true },
      { name: "Custom fields", freelancer: false, team: true, business: true },
      { name: "Bulk operations", freelancer: false, team: true, business: true },
    ],
  },
  {
    category: "Time Tracking",
    features: [
      { name: "Time tracking", freelancer: true, team: true, business: true },
      { name: "Manual time entry", freelancer: true, team: true, business: true },
      { name: "Timer functionality", freelancer: true, team: true, business: true },
      { name: "Time approval workflows", freelancer: false, team: true, business: true },
      { name: "Billable hours tracking", freelancer: true, team: true, business: true },
      { name: "Time estimates", freelancer: false, team: true, business: true },
      { name: "Overtime tracking", freelancer: false, team: true, business: true },
    ],
  },
  {
    category: "Reporting & Analytics",
    features: [
      { name: "Basic reports", freelancer: true, team: true, business: true },
      { name: "Advanced analytics", freelancer: false, team: true, business: true },
      { name: "Custom dashboards", freelancer: false, team: false, business: true },
      { name: "Export to CSV/PDF", freelancer: true, team: true, business: true },
      { name: "Scheduled reports", freelancer: false, team: true, business: true },
      { name: "Real-time insights", freelancer: false, team: true, business: true },
    ],
  },
  {
    category: "Invoice Management",
    features: [
      { name: "Invoice organization", freelancer: true, team: true, business: true },
      { name: "Custom invoice templates", freelancer: false, team: true, business: true },
      { name: "Automated invoice workflows", freelancer: false, team: true, business: true },
      { name: "Payment status tracking", freelancer: true, team: true, business: true },
      { name: "Multi-currency support", freelancer: false, team: false, business: true },
      { name: "Tax calculations", freelancer: false, team: true, business: true },
    ],
  },
  {
    category: "Collaboration",
    features: [
      { name: "Comments & notes", freelancer: true, team: true, business: true },
      { name: "File attachments", freelancer: true, team: true, business: true },
      { name: "Team chat", freelancer: false, team: true, business: true },
      { name: "Client portal", freelancer: false, team: true, business: true },
      { name: "Guest access", freelancer: false, team: true, business: true },
      { name: "Team notifications", freelancer: false, team: true, business: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Email support", freelancer: true, team: true, business: true },
      { name: "Priority support", freelancer: false, team: true, business: true },
      { name: "Phone support", freelancer: false, team: false, business: true },
      { name: "Dedicated account manager", freelancer: false, team: false, business: true },
      { name: "Onboarding assistance", freelancer: false, team: false, business: true },
    ],
  },
]

const pricingPlans = [
  {
    name: "Freelancer",
    price: 29,
    description: "Perfect for individual freelancers and solo entrepreneurs.",
    features: [
      "1 user account",
      "Unlimited projects",
      "Advanced time tracking",
      "Project management tools",
      "Basic reporting",
      "Invoice management",
      "Email support",
    ],
    buttonText: "Get Started",
    href: "/signup?plan=freelancer",
    featured: false,
  },
  {
    name: "Team",
    price: 79,
    description: "Ideal for small to medium teams that need collaboration features.",
    features: [
      "Up to 10 team members",
      "Everything in Freelancer",
      "Team collaboration tools",
      "Advanced reporting & analytics",
      "Time approval workflows",
      "Client portal access",
      "Priority support",
    ],
    buttonText: "Get Started",
    href: "/signup?plan=team",
    featured: true,
  },
  {
    name: "Business",
    price: 199,
    description: "For larger organizations with advanced requirements.",
    features: [
      "Unlimited team members",
      "Everything in Team",
      "Custom reporting dashboard",
      "SSO integration",
      "Custom branding",
      "Advanced security features",
      "Dedicated account manager",
      "24/7 phone support",
    ],
    buttonText: "Contact Sales",
    href: "/contact",
    featured: false,
  },
]

const faqs = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No, all plans are month-to-month. You can cancel at any time and you won't be charged for the next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support payment via PayPal and bank transfer for annual business plans.",
  },
  {
    question: "Do you offer discounts for non-profits or educational institutions?",
    answer:
      "Yes, we offer special pricing for non-profit organizations, educational institutions, and open source projects. Please contact our sales team for more information.",
  },
]
