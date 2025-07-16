import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { businessId: string } }) {
  try {
    const businessId = Number.parseInt(params.businessId)

    if (isNaN(businessId)) {
      return NextResponse.json({ error: "Invalid business ID" }, { status: 400 })
    }

    // Since the businesses table doesn't exist yet, return a default business
    console.log("Businesses table doesn't exist yet, returning default business")

    const defaultBusiness = {
      id: businessId,
      name: "Default Business",
      slug: "default",
      owner_id: 1, // Will be updated when we have proper user context
      plan: "freelancer",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    }

    return NextResponse.json({
      business: defaultBusiness,
    })
  } catch (error) {
    console.log("Error in business API (this is expected if table doesn't exist):", error)

    // Return a default business even if there's an error
    const defaultBusiness = {
      id: Number.parseInt(params.businessId) || 1,
      name: "Default Business",
      slug: "default",
      owner_id: 1,
      plan: "freelancer",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    }

    return NextResponse.json({
      business: defaultBusiness,
    })
  }
}
