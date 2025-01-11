import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

// Handler untuk metode GET
export async function GET() {
  try {
    const getUserByRole = await prisma.user.findMany({
      where: {
        role: "Shahibul Mal", // Ganti sesuai kebutuhan
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(getUserByRole, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
