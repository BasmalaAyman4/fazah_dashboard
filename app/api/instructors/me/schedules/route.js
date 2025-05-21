import { NextResponse } from "next/server";
import {
  connectDB,
  Schedule,
  Sport,
  Workshop,
  SpecialProgram,
  Instructor,
} from "@/lib/mongoose";
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

    // First, find the instructor by email
    const instructor = await Instructor.findOne({ email: session.user.email });

    if (!instructor) {
      return NextResponse.json(
        { message: "لم يتم العثور على المدرب" },
        { status: 404 }
      );
    }

    // Then find schedules where the instructor ID matches
    const schedules = await Schedule.find({
      instructor: instructor._id,
    }).populate("instructor", "name email");

    // Manually populate the activity field
    const populatedSchedules = await Promise.all(
      schedules.map(async (schedule) => {
        let activity;
        let activityTitle;
        let activityTypeLabel;

        switch (schedule.activityType) {
          case "Sport":
            activity = await Sport.findById(schedule.activity).select("name");
            activityTitle = activity?.name;
            activityTypeLabel = "رياضة";
            break;
          case "Workshop":
            activity = await Workshop.findById(schedule.activity).select(
              "title"
            );
            activityTitle = activity?.title;
            activityTypeLabel = "ورشة عمل";
            break;
          case "SpecialProgram":
            activity = await SpecialProgram.findById(schedule.activity).select(
              "title"
            );
            activityTitle = activity?.title;
            activityTypeLabel = "برنامج خاص";
            break;
          default:
            activityTitle = "غير معروف";
            activityTypeLabel = "غير معروف";
        }

        return {
          ...schedule.toObject(),
          activity: activity || schedule.activity,
          activityTitle: activityTitle || "غير معروف",
          activityTypeLabel: activityTypeLabel,
        };
      })
    );

    return NextResponse.json(populatedSchedules);
  } catch (error) {
    console.error("Error fetching instructor schedules:", error);
    return NextResponse.json(
      { message: "خطأ في جلب جداول المدرب" },
      { status: 500 }
    );
  }
}
