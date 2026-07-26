import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all employees and their salaries
export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      select: {
        id: true,
        name: true,
        email: true,
        salaries: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get latest salary record
        },
      },
    });

    return NextResponse.json({ success: true, employees }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Add or Update Salary for an employee
export async function POST(req: Request) {
  try {
    const { userId, amount, bonus, deductions, status } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ success: false, message: "User ID and Amount are required." }, { status: 400 });
    }

    const salary = await prisma.salary.create({
      data: {
        userId,
        amount: parseFloat(amount),
        bonus: bonus ? parseFloat(bonus) : 0,
        deductions: deductions ? parseFloat(deductions) : 0,
        status: status || "Paid",
      },
    });

    return NextResponse.json({ success: true, message: "Salary saved successfully!", salary }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}