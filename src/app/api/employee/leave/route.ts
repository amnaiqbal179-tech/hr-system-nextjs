import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get employee leaves
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    const leaves = await prisma.leave.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, leaves }, { status: 200 });
  } catch (error: any) {
    console.error("GET Leave Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Submit leave request
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, leaveType, startDate, endDate, reason } = body;

    if (!userId || !leaveType || !startDate || !endDate) {
      return NextResponse.json({ success: false, message: "All required fields must be filled." }, { status: 400 });
    }

    const leaveRequest = await prisma.leave.create({
      data: {
        userId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || "",
        status: "Pending",
      },
    });

    return NextResponse.json({ success: true, message: "Leave application submitted successfully!", leaveRequest }, { status: 201 });
  } catch (error: any) {
    console.error("POST Leave Error Details:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}