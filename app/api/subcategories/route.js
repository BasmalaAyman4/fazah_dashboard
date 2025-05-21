import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db("sports_dashboard")

    const categoryId = request.nextUrl.searchParams.get("categoryId")

    let query = {}
    if (categoryId) {
      query = { categoryId }
    }

    const subcategories = await db.collection("subcategories").find(query).sort({ name: 1 }).toArray()

    return NextResponse.json(subcategories)
  } catch (error) {
    console.error("Error fetching subcategories:", error)
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("sports_dashboard")

    const data = await request.json()

    const subcategory = {
      name: data.name,
      description: data.description || "",
      categoryId: data.categoryId,
      isActive: data.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("subcategories").insertOne(subcategory)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...subcategory,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating subcategory:", error)
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 })
  }
}

