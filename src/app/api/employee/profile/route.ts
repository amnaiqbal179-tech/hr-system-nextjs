import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    const employee = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: true,
        salaries: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!employee) {
      return NextResponse.json({ success: false, message: "Employee not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, employee }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}