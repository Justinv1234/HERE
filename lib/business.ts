import { sql } from "./db"

export type Business = {
  id: number
  name: string
  slug: string
  owner_id: number
  plan: string
  industry?: string | null
  status: string
  created_at: Date
  updated_at: Date
}

export async function getBusinessById(id: number): Promise<Business | null> {
  try {
    // Check if businesses table exists first
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'businesses'
      ) as exists
    `

    if (!tableExists[0].exists) {
      console.log("Businesses table doesn't exist yet")
      return null
    }

    const result = await sql`SELECT * FROM businesses WHERE id = ${id}`
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.log("Error getting business by ID (table might not exist):", error)
    return null
  }
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    // Check if businesses table exists first
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'businesses'
      ) as exists
    `

    if (!tableExists[0].exists) {
      console.log("Businesses table doesn't exist yet")
      return null
    }

    const result = await sql`SELECT * FROM businesses WHERE slug = ${slug}`
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.log("Error getting business by slug (table might not exist):", error)
    return null
  }
}

export async function getBusinessesByOwnerId(ownerId: number): Promise<Business[]> {
  try {
    // Check if businesses table exists first
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'businesses'
      ) as exists
    `

    if (!tableExists[0].exists) {
      console.log("Businesses table doesn't exist yet")
      return []
    }

    const result = await sql`SELECT * FROM businesses WHERE owner_id = ${ownerId}`
    return result
  } catch (error) {
    console.log("Error getting businesses by owner ID (table might not exist):", error)
    return []
  }
}

export async function createBusiness({
  name,
  slug,
  owner_id,
  plan = "freelancer",
  industry = null,
}: {
  name: string
  slug: string
  owner_id: number
  plan?: string
  industry?: string | null
}): Promise<Business | null> {
  try {
    // Check if businesses table exists first
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'businesses'
      ) as exists
    `

    if (!tableExists[0].exists) {
      console.log("Businesses table doesn't exist yet, cannot create business")
      return null
    }

    // Try with industry column first
    let result
    try {
      result = await sql`
        INSERT INTO businesses (name, slug, owner_id, plan, industry, status, created_at, updated_at)
        VALUES (${name}, ${slug}, ${owner_id}, ${plan}, ${industry}, 'active', NOW(), NOW())
        RETURNING *
      `
    } catch (error) {
      // If industry column doesn't exist, try without it
      console.log("Industry column might not exist, trying without it")
      result = await sql`
        INSERT INTO businesses (name, slug, owner_id, plan, status, created_at, updated_at)
        VALUES (${name}, ${slug}, ${owner_id}, ${plan}, 'active', NOW(), NOW())
        RETURNING *
      `
    }

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.log("Error creating business (table might not exist):", error)
    return null
  }
}

export async function updateBusiness(
  id: number,
  data: Partial<Omit<Business, "id" | "created_at">>,
): Promise<Business | null> {
  try {
    // Check if businesses table exists first
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'businesses'
      ) as exists
    `

    if (!tableExists[0].exists) {
      console.log("Businesses table doesn't exist yet")
      return null
    }

    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ${value === null ? "NULL" : `'${value}'`}`)
      .join(", ")

    if (!updates) return await getBusinessById(id)

    const result = await sql`
      UPDATE businesses
      SET ${updates}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.log("Error updating business (table might not exist):", error)
    return null
  }
}

export async function addUserToBusiness(userId: number, businessId: number): Promise<boolean> {
  try {
    await sql`
      UPDATE users
      SET business_id = ${businessId}, updated_at = NOW()
      WHERE id = ${userId}
    `
    return true
  } catch (error) {
    console.log("Error adding user to business:", error)
    return false
  }
}

export async function getUsersByBusinessId(businessId: number): Promise<any[]> {
  try {
    const result = await sql`
      SELECT id, name, email, role, status, created_at, updated_at
      FROM users
      WHERE business_id = ${businessId}
    `
    return result
  } catch (error) {
    console.log("Error getting users by business ID:", error)
    return []
  }
}
