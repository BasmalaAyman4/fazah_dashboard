import { NextResponse } from "next/server";
import { connectDB, Specialist2 } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const specialists = await Specialist2.find().sort({ createdAt: -1 });
    return NextResponse.json(specialists);
  } catch (error) {
    return NextResponse.json(
      { message: "خطأ في جلب المتخصصين" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const specialist = await Specialist2.create({
      name: body.name,
      description: body.description,
      label: body.label,
      image: body.image,
    });

    return NextResponse.json(specialist);
  } catch (error) {
    return NextResponse.json(
      { message: "خطأ في إنشاء المتخصص" },
      { status: 500 }
    );
  }
}
