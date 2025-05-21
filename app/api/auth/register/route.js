import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Instructor } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

    // Validate input
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { message: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if instructor already exists
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new instructor
    const instructor = await Instructor.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "instructor",
    });

    // Remove password from response
    const { password: _, ...instructorWithoutPassword } = instructor.toObject();

    return NextResponse.json(
      {
        message: "تم إنشاء الحساب بنجاح",
        instructor: instructorWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}
