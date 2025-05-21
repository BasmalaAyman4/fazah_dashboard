import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "لم يتم تحديد ملف" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const path = join(process.cwd(), "public/uploads", filename);

    // Save the file
    await writeFile(path, buffer);

    // Return the public URL
    return NextResponse.json({
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: "خطأ في رفع الملف" }, { status: 500 });
  }
}
