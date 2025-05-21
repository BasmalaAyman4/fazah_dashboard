import { NextResponse } from "next/server";
import { connectDB, Instructor } from "@/lib/mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    await connectDB();
    const instructor = await Instructor.findOne({ email: session.user.email })
      .populate("sports", "name")
      .populate("schedules", "day startTime endTime");

    if (!instructor) {
      return NextResponse.json(
        { message: "لم يتم العثور على المدرب" },
        { status: 404 }
      );
    }

    // Ensure sports is always an array
    const response = {
      ...instructor.toObject(),
      sports: Array.isArray(instructor.sports) ? instructor.sports : [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return NextResponse.json(
      { message: "خطأ في جلب بيانات المدرب" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    await connectDB();
    const formData = await request.formData();
    const updateData = {};

    // Handle form data fields
    for (const [key, value] of formData.entries()) {
      if (key === "sports") {
        try {
          const sportsData = JSON.parse(value);
          updateData[key] = Array.isArray(sportsData) ? sportsData : [];
        } catch (error) {
          console.error("Error parsing sports data:", error);
          updateData[key] = [];
        }
      } else if (key === "image" && value instanceof File) {
        // Handle image upload here if needed
        // For now, we'll just store the file name
        updateData[key] = value.name;
      } else {
        updateData[key] = value;
      }
    }

    const instructor = await Instructor.findOneAndUpdate(
      { email: session.user.email },
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("sports", "name");

    if (!instructor) {
      return NextResponse.json(
        { message: "لم يتم العثور على المدرب" },
        { status: 404 }
      );
    }

    // Ensure sports is always an array in the response
    const response = {
      ...instructor.toObject(),
      sports: Array.isArray(instructor.sports) ? instructor.sports : [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating instructor:", error);
    return NextResponse.json(
      { message: "خطأ في تحديث بيانات المدرب" },
      { status: 500 }
    );
  }
}
