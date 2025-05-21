import { NextResponse } from "next/server";
import { connectDB, Workshop } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const workshops = await Workshop.find().sort({ createdAt: -1 });
    return NextResponse.json(workshops);
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return NextResponse.json(
      { error: "Failed to fetch workshops" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const workshop = await Workshop.create(data);
    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.error("Error creating workshop:", error);
    return NextResponse.json(
      { error: "Failed to create workshop" },
      { status: 500 }
    );
  }
}
