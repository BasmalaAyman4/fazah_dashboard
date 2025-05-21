import { NextResponse } from "next/server";
import { connectDB, Client } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const instructor = await Client.findById(id);
    if (!instructor) {
      return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
    }
    return NextResponse.json(instructor);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "فشل في جلب بيانات العميل" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await request.json();
    const instructor = await Client.findById(id);

    if (!instructor) {
      return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
    }

    // If password is provided, hash it
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    // Update instructor
    const updatedInstructor = await Client.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    // Remove password from response
    const { password, ...clientWithoutPassword } =
      updatedInstructor.toObject();

    return NextResponse.json(clientWithoutPassword);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "فشل في تحديث بيانات العميل" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const instructor = await Client.findByIdAndDelete(id);
    if (!instructor) {
      return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ message: "تم حذف العميل بنجاح" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "فشل في حذف العميل" }, { status: 500 });
  }
}
