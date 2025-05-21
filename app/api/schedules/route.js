import { NextResponse } from "next/server";
import {
  connectDB,
  Schedule,
  Sport,
  Workshop,
  SpecialProgram,
} from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const schedules = await Schedule.find({})
      .populate("instructor", "name email specialties")
      .sort({ createdAt: -1 });

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
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { message: "خطأ في جلب بيانات الجداول" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Determine the activity type based on the activity ID
    let activityType = body.activityType;

    if (!activityType && body.activity) {
      // Check if the activity exists in each collection
      const sport = await Sport.findById(body.activity);
      if (sport) {
        activityType = "Sport";
      } else {
        const workshop = await Workshop.findById(body.activity);
        if (workshop) {
          activityType = "Workshop";
        } else {
          const specialProgram = await SpecialProgram.findById(body.activity);
          if (specialProgram) {
            activityType = "SpecialProgram";
          }
        }
      }
    }

    // Validate required fields
    if (!body.day) {
      return NextResponse.json({ message: "اليوم مطلوب" }, { status: 400 });
    }

    if (!activityType) {
      return NextResponse.json(
        { message: "نوع النشاط مطلوب" },
        { status: 400 }
      );
    }

    if (!body.activity) {
      return NextResponse.json({ message: "النشاط مطلوب" }, { status: 400 });
    }

    const schedule = await Schedule.create({
      day: body.day,
      startTime: body.startTime,
      endTime: body.endTime,
      activityType: activityType,
      activity: body.activity,
      instructor: body.instructor,
      maximumParticipants: body.maximumParticipants || 0,
      showParticipants: body.showParticipants || false,
      status: "active",
    });

    // Manually populate the activity field
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
        activity = await Workshop.findById(schedule.activity).select("title");
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

    const populatedSchedule = {
      ...schedule.toObject(),
      activity: activity || schedule.activity,
      activityTitle: activityTitle || "غير معروف",
      activityTypeLabel: activityTypeLabel,
    };

    return NextResponse.json(populatedSchedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { message: "خطأ في إنشاء الجدول", error: error.message },
      { status: 500 }
    );
  }
}
