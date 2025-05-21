import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  connectDB,
  Schedule,
  Sport,
  Workshop,
  SpecialProgram,
} from "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "غير مصرح لك بإنشاء الجداول" },
        { status: 401 }
      );
    }

    const { schedules } = await req.json();

    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      return NextResponse.json(
        { message: "يجب توفير مصفوفة من الجداول" },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate each schedule
    for (const schedule of schedules) {
      if (
        !schedule.day ||
        !schedule.date ||
        !schedule.activityType ||
        !schedule.activity
      ) {
        return NextResponse.json(
          { message: "يجب توفير اليوم والتاريخ ونوع النشاط والنشاط لكل جدول" },
          { status: 400 }
        );
      }

      // Extract month and day from the date
      const date = new Date(schedule.date);
      date.setUTCHours(0, 0, 0, 0); // Set to UTC midnight
      schedule.date = date;
      schedule.month = date.getUTCMonth() + 1; // getUTCMonth() returns 0-11
      schedule.dayOfMonth = date.getUTCDate();
    }

    // Create all schedules
    const createdSchedules = await Schedule.insertMany(schedules);

    // Populate the activity field for each schedule
    const populatedSchedules = await Promise.all(
      createdSchedules.map(async (schedule) => {
        let populatedSchedule = schedule.toObject();
        let activity;
        let activityTitle;
        let activityTypeLabel;

        // Populate the activity based on activityType
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
          ...populatedSchedule,
          activity: activity || schedule.activity,
          activityTitle: activityTitle || "غير معروف",
          activityTypeLabel: activityTypeLabel,
        };
      })
    );

    return NextResponse.json(populatedSchedules, { status: 201 });
  } catch (error) {
    console.error("Error creating schedules:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الجداول", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "غير مصرح لك بحذف الجداول" },
        { status: 401 }
      );
    }

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "يجب توفير مصفوفة من معرفات الجداول" },
        { status: 400 }
      );
    }

    await connectDB();

    // Delete all schedules with the provided IDs
    const result = await Schedule.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "لم يتم العثور على جداول للحذف" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `تم حذف ${result.deletedCount} جدول بنجاح` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting schedules:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء حذف الجداول", error: error.message },
      { status: 500 }
    );
  }
}
