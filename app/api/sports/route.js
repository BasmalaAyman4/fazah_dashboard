import { NextResponse } from "next/server";
import { connectDB, Sport } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const sports = await Sport.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sports);
  } catch (error) {
    console.error("Error fetching sports:", error);
    return NextResponse.json(
      { error: "Failed to fetch sports" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const sport = await Sport.create(body);
    return NextResponse.json(sport, { status: 201 });
  } catch (error) {
    console.error("Error creating sport:", error);
    return NextResponse.json(
      { error: "Failed to create sport" },
      { status: 500 }
    );
  }
}
