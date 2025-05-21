import { NextResponse } from "next/server";
import { connectDB, Instructor } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const instructor = await Instructor.findById(id).populate("sports");
    if (!instructor) {
      return NextResponse.json({ error: "المدرب غير موجود" }, { status: 404 });
    }
    return NextResponse.json(instructor);
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return NextResponse.json(
      { error: "فشل في جلب بيانات المدرب" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await request.json();
    const instructor = await Instructor.findById(id);

    if (!instructor) {
      return NextResponse.json({ error: "المدرب غير موجود" }, { status: 404 });
    }

    // If password is provided, hash it
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    // Update instructor
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    // Remove password from response
    const { password, ...instructorWithoutPassword } =
      updatedInstructor.toObject();

    return NextResponse.json(instructorWithoutPassword);
  } catch (error) {
    console.error("Error updating instructor:", error);
    return NextResponse.json(
      { error: "فشل في تحديث بيانات المدرب" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const instructor = await Instructor.findByIdAndDelete(id);
    if (!instructor) {
      return NextResponse.json({ error: "المدرب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ message: "تم حذف المدرب بنجاح" });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    return NextResponse.json({ error: "فشل في حذف المدرب" }, { status: 500 });
  }
}
