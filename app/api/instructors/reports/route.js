import { NextResponse } from "next/server";
import { connectDB, Schedule, Instructor } from "@/lib/mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const instructorId = searchParams.get("instructorId");
    const showOnlyDelegated = searchParams.get("showOnlyDelegated") === "true";
    const showOnlyCanceled = searchParams.get("showOnlyCanceled") === "true";

    // Create base filter
    const baseFilter = {};

    // Add date filter
    if (startDate || endDate) {
      baseFilter.date = {};
      if (startDate) baseFilter.date.$gte = new Date(startDate);
      if (endDate) baseFilter.date.$lte = new Date(endDate);
    }

    // Add instructor filter
    if (instructorId && instructorId !== "all") {
      baseFilter.instructor = instructorId;
    }

    // Add status filter
    if (showOnlyCanceled) {
      baseFilter.status = "canceled";
    }

    // Get all instructors
    const instructors = instructorId
      ? await Instructor.find({ _id: instructorId })
      : await Instructor.find({});

    // Get all schedules with filters
    const allSchedules = await Schedule.find(baseFilter);

    // Get all schedules with delegation and filters
    const delegatedSchedules = await Schedule.find({
      ...baseFilter,
      delegatedTo: { $exists: true, $ne: null },
    });

    // If showOnlyDelegated is true, only include delegated schedules
    const schedulesToUse = showOnlyDelegated
      ? delegatedSchedules
      : allSchedules;

    // Calculate total statistics
    const totalStats = {
      completedSessions: schedulesToUse.filter(
        (schedule) => schedule.status === "completed" && !schedule.isPrivate
      ).length,
      completedPrivateSessions: schedulesToUse.filter(
        (schedule) => schedule.status === "completed" && schedule.isPrivate
      ).length,
      canceledSessions: schedulesToUse.filter(
        (schedule) => schedule.status === "canceled" && !schedule.isPrivate
      ).length,
      canceledPrivateSessions: schedulesToUse.filter(
        (schedule) => schedule.status === "canceled" && schedule.isPrivate
      ).length,
      delegatedToOthers: delegatedSchedules.filter(
        (schedule) => !schedule.isPrivate
      ).length,
      delegatedFromOthers: delegatedSchedules.filter(
        (schedule) => !schedule.isPrivate
      ).length,
      privateDelegatedToOthers: delegatedSchedules.filter(
        (schedule) => schedule.isPrivate
      ).length,
      privateDelegatedFromOthers: delegatedSchedules.filter(
        (schedule) => schedule.isPrivate
      ).length,
    };

    // Calculate statistics per instructor
    const instructorStats = await Promise.all(
      instructors.map(async (instructor) => {
        const instructorSchedules = schedulesToUse.filter(
          (schedule) =>
            schedule.instructor.toString() === instructor._id.toString()
        );

        const delegatedToInstructor = schedulesToUse.filter(
          (schedule) =>
            schedule.delegatedTo?.toString() === instructor._id.toString()
        );

        const delegatedByInstructor = delegatedSchedules.filter(
          (schedule) =>
            schedule.instructor.toString() === instructor._id.toString()
        );

        return {
          instructorId: instructor._id,
          instructorName: instructor.name,
          completedSessions: instructorSchedules.filter(
            (schedule) => schedule.status === "completed" && !schedule.isPrivate
          ).length,
          completedPrivateSessions: instructorSchedules.filter(
            (schedule) => schedule.status === "completed" && schedule.isPrivate
          ).length,
          canceledSessions: instructorSchedules.filter(
            (schedule) => schedule.status === "canceled" && !schedule.isPrivate
          ).length,
          canceledPrivateSessions: instructorSchedules.filter(
            (schedule) => schedule.status === "canceled" && schedule.isPrivate
          ).length,
          delegatedToOthers: delegatedByInstructor.filter(
            (schedule) => !schedule.isPrivate
          ).length,
          delegatedFromOthers: delegatedToInstructor.filter(
            (schedule) => !schedule.isPrivate
          ).length,
          privateDelegatedToOthers: delegatedByInstructor.filter(
            (schedule) => schedule.isPrivate
          ).length,
          privateDelegatedFromOthers: delegatedToInstructor.filter(
            (schedule) => schedule.isPrivate
          ).length,
        };
      })
    );

    return NextResponse.json({
      totalStats,
      instructorStats,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { message: "خطأ في جلب التقارير" },
      { status: 500 }
    );
  }
}
