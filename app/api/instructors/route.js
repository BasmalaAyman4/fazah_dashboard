import { NextResponse } from "next/server";
import { connectDB, Instructor } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    const instructors = await Instructor.find({}).sort({ createdAt: -1 });
    return NextResponse.json(instructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Hash the password if it exists
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      body.password = hashedPassword;
    }

    // Set the role to instructor
    body.role = "instructor";

    const instructor = await Instructor.create(body);

    // Remove password from response
    const { password, ...instructorWithoutPassword } = instructor.toObject();

    return NextResponse.json(instructorWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating instructor:", error);
    return NextResponse.json(
      { error: "Failed to create instructor" },
      { status: 500 }
    );
  }
}
