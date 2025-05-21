import { NextResponse } from "next/server";
import { connectDB, SpecialProgram } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const specialPrograms = await SpecialProgram.find().sort({ createdAt: -1 });
    return NextResponse.json(specialPrograms);
  } catch (error) {
    console.error("Error fetching special programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch special programs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const specialProgram = await SpecialProgram.create(data);
    return NextResponse.json(specialProgram, { status: 201 });
  } catch (error) {
    console.error("Error creating special program:", error);
    return NextResponse.json(
      { error: "Failed to create special program" },
      { status: 500 }
    );
  }
}
