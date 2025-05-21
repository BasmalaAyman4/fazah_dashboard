import { NextResponse } from "next/server";
import { connectDB, Schedule, Instructor } from "@/lib/mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    await connectDB();

    // First, find the instructor by ID
    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return NextResponse.json(
        { message: "لم يتم العثور على المدرب" },
        { status: 404 }
      );
    }

    // Get all schedules for this instructor
    const allSchedules = await Schedule.find({
      instructor: instructor._id,
    });

    // Get all schedules delegated to this instructor
    const delegatedToInstructor = await Schedule.find({
      delegatedTo: instructor._id,
    });

    // Get all schedules delegated by this instructor
    const delegatedByInstructor = await Schedule.find({
      instructor: instructor._id,
      delegatedTo: { $exists: true, $ne: null },
    });

    // Count completed regular sessions
    const completedSessions = allSchedules.filter(
      (schedule) => schedule.status === "completed" && !schedule.isPrivate
    ).length;

    // Count completed private sessions
    const completedPrivateSessions = allSchedules.filter(
      (schedule) => schedule.status === "completed" && schedule.isPrivate
    ).length;

    // Count canceled regular sessions
    const canceledSessions = allSchedules.filter(
      (schedule) => schedule.status === "canceled" && !schedule.isPrivate
    ).length;

    // Count canceled private sessions
    const canceledPrivateSessions = allSchedules.filter(
      (schedule) => schedule.status === "canceled" && schedule.isPrivate
    ).length;

    // Count sessions delegated to another instructor
    const delegatedToOthers = delegatedByInstructor.filter(
      (schedule) => !schedule.isPrivate
    ).length;

    // Count sessions delegated from another instructor
    const delegatedFromOthers = delegatedToInstructor.filter(
      (schedule) => !schedule.isPrivate
    ).length;

    // Count private sessions delegated to another instructor
    const privateDelegatedToOthers = delegatedByInstructor.filter(
      (schedule) => schedule.isPrivate
    ).length;

    // Count private sessions delegated from another instructor
    const privateDelegatedFromOthers = delegatedToInstructor.filter(
      (schedule) => schedule.isPrivate
    ).length;

    return NextResponse.json({
      completedSessions,
      completedPrivateSessions,
      canceledSessions,
      canceledPrivateSessions,
      delegatedToOthers,
      delegatedFromOthers,
      privateDelegatedToOthers,
      privateDelegatedFromOthers,
    });
  } catch (error) {
    console.error("Error fetching instructor reports:", error);
    return NextResponse.json(
      { message: "خطأ في جلب تقارير المدرب" },
      { status: 500 }
    );
  }
}
