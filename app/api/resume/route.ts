import { NextResponse } from "next/server";
import resume from "@/content/resume.json";

export async function GET() {
  try {
    return NextResponse.json(resume, { status: 200 });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 },
    );
  }
}
