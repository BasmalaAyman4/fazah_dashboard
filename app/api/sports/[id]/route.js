import { NextResponse } from "next/server";
import { connectDB, Sport } from "@/lib/mongoose";

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const sport = await Sport.findById(id)
      .populate("instructors", "name email")
      .populate("schedules", "day startTime endTime");

    if (!sport) {
      return NextResponse.json(
        { message: "لم يتم العثور على الرياضة" },
        { status: 404 }
      );
    }
    return NextResponse.json(sport);
  } catch (error) {
    console.error("Error fetching sport:", error);
    return NextResponse.json(
      { message: "خطأ في جلب بيانات الرياضة" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const { id } = context.params;
    await connectDB();
    const body = await request.json();

    const sport = await Sport.findByIdAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
        status: body.status || "active",
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("instructors", "name email");

    if (!sport) {
      return NextResponse.json(
        { message: "لم يتم العثور على الرياضة" },
        { status: 404 }
      );
    }

    return NextResponse.json(sport);
  } catch (error) {
    console.error("Error updating sport:", error);
    return NextResponse.json(
      { message: "خطأ في تحديث الرياضة" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = context.params;
    await connectDB();
    const sport = await Sport.findByIdAndDelete(id);

    if (!sport) {
      return NextResponse.json(
        { message: "لم يتم العثور على الرياضة" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "تم حذف الرياضة بنجاح" });
  } catch (error) {
    console.error("Error deleting sport:", error);
    return NextResponse.json(
      { message: "خطأ في حذف الرياضة" },
      { status: 500 }
    );
  }
}
