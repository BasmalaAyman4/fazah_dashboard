import { NextResponse } from "next/server";
import { connectDB, Package } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const packages = await Package.find().sort({ createdAt: -1 });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ message: "خطأ في جلب الحزم" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const packageData = await Package.create({
      title: body.title,
      sport: body.sport,
      type: body.type,
      duration: body.duration,
      description: body.description,
      price: body.price,
    });

    return NextResponse.json(packageData);
  } catch (error) {
    return NextResponse.json(
      { message: "خطأ في إنشاء الحزمة" },
      { status: 500 }
    );
  }
}
