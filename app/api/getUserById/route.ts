import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { NextRequest } from "next/server"; // Import tipe NextRequest

// Handler untuk metode GET dengan ID di body
export async function POST(request: NextRequest) { // Ubah menjadi metode POST
  try {
    // Mendapatkan body dari request
    const body = await request.json();
    const userId = body.id; // Ambil ID dari body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Query ke database untuk mendapatkan user berdasarkan ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
