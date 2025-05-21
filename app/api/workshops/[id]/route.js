import { NextResponse } from "next/server";
import { connectDB, Workshop } from "@/lib/mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const workshop = await Workshop.findById(params.id);
    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(workshop);
  } catch (error) {
    console.error("Error fetching workshop:", error);
    return NextResponse.json(
      { error: "Failed to fetch workshop" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    const workshop = await Workshop.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(workshop);
  } catch (error) {
    console.error("Error updating workshop:", error);
    return NextResponse.json(
      { error: "Failed to update workshop" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const workshop = await Workshop.findByIdAndDelete(params.id);
    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Workshop deleted successfully" });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return NextResponse.json(
      { error: "Failed to delete workshop" },
      { status: 500 }
    );
  }
}
