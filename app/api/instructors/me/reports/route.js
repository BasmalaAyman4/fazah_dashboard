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
    const sport = searchParams.get("sport");
    const showOnlyCompleted = searchParams.get("showOnlyCompleted") === "true";
    const showOnlyPrivateCompleted =
      searchParams.get("showOnlyPrivateCompleted") === "true";
    const showOnlyCanceled = searchParams.get("showOnlyCanceled") === "true";
    const showOnlyPrivateCanceled =
      searchParams.get("showOnlyPrivateCanceled") === "true";
    const showOnlyDelegated = searchParams.get("showOnlyDelegated") === "true";
    const showOnlyReceived = searchParams.get("showOnlyReceived") === "true";
    const showOnlyPrivateDelegated =
      searchParams.get("showOnlyPrivateDelegated") === "true";
    const showOnlyPrivateReceived =
      searchParams.get("showOnlyPrivateReceived") === "true";

    // First, find the instructor by email
    const instructor = await Instructor.findOne({ email: session.user.email });

    if (!instructor) {
      return NextResponse.json(
        { message: "لم يتم العثور على المدرب" },
        { status: 404 }
      );
    }

    // Create base filter
    const baseFilter = {
      $or: [{ instructor: instructor._id }, { delegatedTo: instructor._id }],
    };

    // Add date filter
    if (startDate || endDate) {
      baseFilter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        baseFilter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        baseFilter.date.$lte = end;
        c;
      }
    }

    // Add sport filter
    if (sport && sport !== "all") {
      baseFilter.sport = sport;
    }

    // Get all schedules with filters
    const allSchedules = await Schedule.find(baseFilter);
    if (allSchedules.length === 0) {
      // Check if there are any schedules at all
      const totalSchedules = await Schedule.countDocuments();
      if (totalSchedules > 0) {
        // Get a sample of schedules to see their dates
        const sampleSchedules = await Schedule.find().limit(5);
      }
    }

    // Apply additional filters in memory
    let filteredSchedules = allSchedules;

    if (showOnlyCompleted) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.status === "completed"
      );
    }

    if (showOnlyPrivateCompleted) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.status === "completed" && schedule.isPrivate
      );
    }

    if (showOnlyCanceled) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.status === "canceled" && !schedule.isPrivate
      );
    }

    if (showOnlyPrivateCanceled) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.status === "canceled" && schedule.isPrivate
      );
    }

    if (showOnlyDelegated) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.delegatedTo && !schedule.isPrivate
      );
    }

    if (showOnlyReceived) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) =>
          schedule.delegatedTo?.equals(instructor._id) && !schedule.isPrivate
      );
    }

    if (showOnlyPrivateDelegated) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.delegatedTo && schedule.isPrivate
      );
    }

    if (showOnlyPrivateReceived) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) =>
          schedule.delegatedTo?.equals(instructor._id) && schedule.isPrivate
      );
    }

    // Count completed regular sessions
    const completedSessions = filteredSchedules.filter(
      (schedule) => schedule.status === "completed" && !schedule.isPrivate
    ).length;

    // Count completed private sessions
    const completedPrivateSessions = filteredSchedules.filter(
      (schedule) => schedule.status === "completed" && schedule.isPrivate
    ).length;

    // Count canceled regular sessions
    const canceledSessions = filteredSchedules.filter(
      (schedule) => schedule.status === "canceled" && !schedule.isPrivate
    ).length;

    // Count canceled private sessions
    const canceledPrivateSessions = filteredSchedules.filter(
      (schedule) => schedule.status === "canceled" && schedule.isPrivate
    ).length;

    // Count sessions delegated to another instructor
    const delegatedToOthers = filteredSchedules.filter(
      (schedule) => schedule.delegatedTo && !schedule.isPrivate
    ).length;

    // Count sessions delegated from another instructor
    const delegatedFromOthers = filteredSchedules.filter(
      (schedule) =>
        schedule.delegatedTo?.equals(instructor._id) && !schedule.isPrivate
    ).length;

    // Count private sessions delegated to another instructor
    const privateDelegatedToOthers = filteredSchedules.filter(
      (schedule) => schedule.delegatedTo && schedule.isPrivate
    ).length;

    // Count private sessions delegated from another instructor
    const privateDelegatedFromOthers = filteredSchedules.filter(
      (schedule) =>
        schedule.delegatedTo?.equals(instructor._id) && schedule.isPrivate
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
