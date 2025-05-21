import { NextResponse } from "next/server";
import { connectDB, SpecialProgram } from "@/lib/mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const specialProgram = await SpecialProgram.findById(params.id);
    if (!specialProgram) {
      return NextResponse.json(
        { error: "Special program not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(specialProgram);
  } catch (error) {
    console.error("Error fetching special program:", error);
    return NextResponse.json(
      { error: "Failed to fetch special program" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    const specialProgram = await SpecialProgram.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );
    if (!specialProgram) {
      return NextResponse.json(
        { error: "Special program not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(specialProgram);
  } catch (error) {
    console.error("Error updating special program:", error);
    return NextResponse.json(
      { error: "Failed to update special program" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const specialProgram = await SpecialProgram.findByIdAndDelete(params.id);
    if (!specialProgram) {
      return NextResponse.json(
        { error: "Special program not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Special program deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting special program:", error);
    return NextResponse.json(
      { error: "Failed to delete special program" },
      { status: 500 }
    );
  }
}
