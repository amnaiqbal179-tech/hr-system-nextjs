import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Update Company
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, email, phone, location, website } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Company name is required." }, { status: 400 });
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: { name, email, phone, location, website },
    });

    return NextResponse.json({ success: true, message: "Company updated successfully!", company: updatedCompany }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Delete Company
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Company deleted successfully!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}