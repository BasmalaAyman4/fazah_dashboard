import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Schedule, Instructor } from "@/lib/mongoose";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Get the instructor's email from the session
    const instructorEmail = session.user.email;

    // First, find the instructor by email to get their ID
    const instructor = await Instructor.findOne({ email: instructorEmail });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
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
        console.log("Start Date:", {
          input: startDate,
          parsed: start,
          iso: start.toISOString(),
          local: start.toLocaleString(),
        });
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        baseFilter.date.$lte = end;
        console.log("End Date:", {
          input: endDate,
          parsed: end,
          iso: end.toISOString(),
          local: end.toLocaleString(),
        });
      }
    }

    // Add sport filter
    if (sport && sport !== "all") {
      baseFilter.sport = sport;
    }

    // Get all schedules with filters
    console.log("Query filter:", JSON.stringify(baseFilter, null, 2));
    const schedules = await Schedule.find(baseFilter).sort({ date: -1 });
    console.log("Found schedules:", schedules.length);
    if (schedules.length === 0) {
      // Check if there are any schedules at all
      const totalSchedules = await Schedule.countDocuments();
      console.log("Total schedules in database:", totalSchedules);
      if (totalSchedules > 0) {
        // Get a sample of schedules to see their dates
        const sampleSchedules = await Schedule.find().limit(5);
        console.log(
          "Sample schedules from database:",
          sampleSchedules.map((s) => ({
            _id: s._id,
            date: s.date,
            iso: s.date.toISOString(),
            local: s.date.toLocaleString(),
          }))
        );
      }
    }

    // Apply additional filters in memory
    let filteredSchedules = schedules;

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

    // Group schedules by date
    const dailyStats = filteredSchedules.reduce((acc, schedule) => {
      const date = schedule.date.toISOString().split("T")[0];
      const day = schedule.day;

      if (!acc[date]) {
        acc[date] = {
          date,
          day,
          totalSessions: 0,
          privateSessions: 0,
          canceledSessions: 0,
          canceledPrivateSessions: 0,
          delegatedToOthers: 0,
          delegatedFromOthers: 0,
          privateDelegatedToOthers: 0,
          privateDelegatedFromOthers: 0,
        };
      }

      // Count total sessions
      acc[date].totalSessions++;

      // Count private sessions
      if (schedule.isPrivate) {
        acc[date].privateSessions++;
      }

      // Count canceled sessions
      if (schedule.status === "canceled") {
        acc[date].canceledSessions++;
        if (schedule.isPrivate) {
          acc[date].canceledPrivateSessions++;
        }
      }

      // Count delegated sessions
      if (schedule.delegatedTo && schedule.delegatedTo.equals(instructor._id)) {
        acc[date].delegatedFromOthers++;
        if (schedule.isPrivate) {
          acc[date].privateDelegatedFromOthers++;
        }
      }

      if (
        schedule.delegatedTo &&
        !schedule.delegatedTo.equals(instructor._id)
      ) {
        acc[date].delegatedToOthers++;
        if (schedule.isPrivate) {
          acc[date].privateDelegatedToOthers++;
        }
      }

      return acc;
    }, {});

    // Convert the object to an array and sort by date
    const dailyStatsArray = Object.values(dailyStats).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return NextResponse.json(dailyStatsArray);
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    return NextResponse.json(
      { error: "Error fetching daily stats" },
      { status: 500 }
    );
  }
}
