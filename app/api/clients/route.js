import { NextResponse } from "next/server";
import { connectDB, Client } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({}).sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Hash the password if it exists
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      body.password = hashedPassword;
    }

    // Set the role to instructor
    body.role = "client";

    const client = await Client.create(body);

    // Remove password from response
    const { password, ...clientWithoutPassword } = client.toObject();

    return NextResponse.json(clientWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
