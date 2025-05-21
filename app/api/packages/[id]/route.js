import { NextResponse } from "next/server";
import { Package } from "@/lib/mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const packageData = await Package.findById(params.id).populate(
      "sport",
      "name"
    );

    if (!packageData) {
      return NextResponse.json(
        { message: "الحزمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(packageData);
  } catch (error) {
    return NextResponse.json({ message: "خطأ في جلب الحزمة" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();

    const packageData = await Package.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        sport: body.sport,
        type: body.type,
        duration: body.duration,
        description: body.description,
        price: body.price,
      },
      { new: true }
    ).populate("sport", "name");

    if (!packageData) {
      return NextResponse.json(
        { message: "الحزمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(packageData);
  } catch (error) {
    return NextResponse.json(
      { message: "خطأ في تحديث الحزمة" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const packageData = await Package.findByIdAndDelete(params.id);

    if (!packageData) {
      return NextResponse.json(
        { message: "الحزمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "تم حذف الحزمة بنجاح" });
  } catch (error) {
    return NextResponse.json({ message: "خطأ في حذف الحزمة" }, { status: 500 });
  }
}
