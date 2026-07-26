import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
    });

    const totalEmployees = await prisma.user.count({
      where: { role: "EMPLOYEE" },
    });

    const totalHRs = await prisma.user.count({
      where: { role: "HR" },
    });

    return NextResponse.json({ success: true, companies, totalEmployees, totalHRs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, location, website } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Company name is required." }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: { name, email, phone, location, website },
    });

    return NextResponse.json({ success: true, message: "Company registered successfully!", company }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}