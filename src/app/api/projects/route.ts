import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET All Projects
export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

// POST Create Project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, status, deadline, companyId } = body;

    if (!title || !companyId) {
      return NextResponse.json(
        { success: false, message: "Project title and company are required." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        status: status || "Ongoing",
        deadline: deadline ? new Date(deadline) : null,
        companyId,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create project." },
      { status: 500 }
    );
  }
}