import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Get all HR users
export async function GET() {
  try {
    const hrUsers = await prisma.user.findMany({
      where: { role: "HR" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, hrUsers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Create new HR account
export async function POST(req: Request) {
  try {
    const { name, email, password, companyId } = await req.json();

    if (!name || !email || !password || !companyId) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email is already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hrUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "HR",
        companyId,
      },
    });

    return NextResponse.json({ success: true, message: "HR account created successfully!", hrUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}