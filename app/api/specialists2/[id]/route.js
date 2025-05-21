import { NextResponse } from "next/server";
import { connectDB, Specialist2 } from "@/lib/mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const specialist = await Specialist2.findById(id);

    if (!specialist) {
      return NextResponse.json(
        { message: "لم يتم العثور على المتخصص" },
        { status: 404 }
      );
    }
    return NextResponse.json(specialist);
  } catch (error) {
    console.error("Error fetching specialist:", error);
    return NextResponse.json(
      { message: "خطأ في جلب بيانات المتخصص" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();

    const specialist = await Specialist2.findByIdAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
        label: body.label,
        image: body.image,
        status: body.status || "active",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!specialist) {
      return NextResponse.json(
        { message: "لم يتم العثور على المتخصص" },
        { status: 404 }
      );
    }

    return NextResponse.json(specialist);
  } catch (error) {
    console.error("Error updating specialist:", error);
    return NextResponse.json(
      { message: "خطأ في تحديث بيانات المتخصص" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const specialist = await Specialist2.findByIdAndDelete(id);

    if (!specialist) {
      return NextResponse.json(
        { message: "لم يتم العثور على المتخصص" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "تم حذف المتخصص بنجاح" });
  } catch (error) {
    console.error("Error deleting specialist:", error);
    return NextResponse.json(
      { message: "خطأ في حذف المتخصص" },
      { status: 500 }
    );
  }
}
