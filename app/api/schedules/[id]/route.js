import { NextResponse } from "next/server";
import {
  connectDB,
  Schedule,
  Sport,
  Workshop,
  SpecialProgram,
} from "@/lib/mongoose";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const schedule = await Schedule.findById(id).populate(
      "instructor",
      "name email"
    );

    if (!schedule) {
      return NextResponse.json(
        { message: "لم يتم العثور على الجدول" },
        { status: 404 }
      );
    }

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

    return NextResponse.json(populatedSchedule);
  } catch (error) {
    return NextResponse.json(
      { message: "خطأ في جلب بيانات الجدول" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await request.json();

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      {
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        activityType: body.activityType,
        activity: body.activity,
        instructor: body.instructor,
        maximumParticipants: body.maximumParticipants || 0,
        showParticipants: body.showParticipants || false,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("instructor", "name email");

    if (!schedule) {
      return NextResponse.json(
        { message: "لم يتم العثور على الجدول" },
        { status: 404 }
      );
    }

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

    return NextResponse.json(populatedSchedule);
  } catch (error) {
    return NextResponse.json(
      { message: "خطأ في تحديث الجدول" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return NextResponse.json(
        { message: "لم يتم العثور على الجدول" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "تم حذف الجدول بنجاح" });
  } catch (error) {
    return NextResponse.json({ message: "خطأ في حذف الجدول" }, { status: 500 });
  }
}
