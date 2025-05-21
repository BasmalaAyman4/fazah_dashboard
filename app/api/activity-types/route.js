import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // Define the activity types
    const activityTypes = [
      {
        _id: "sports",
        name: "رياضة",
        description: "الأنشطة الرياضية",
      },
      {
        _id: "workshops",
        name: "ورشة",
        description: "الورش التدريبية",
      },
      {
        _id: "special-programs",
        name: "برنامج خاص",
        description: "البرامج الخاصة",
      },
    ];

    return NextResponse.json(activityTypes);
  } catch (error) {
    console.error("Error fetching activity types:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity types" },
      { status: 500 }
    );
  }
}
