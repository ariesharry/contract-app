// app/api/contracts/status/route.js
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET() {
  try {
    // Hitung jumlah contract berdasarkan status
    const createdCount = await prisma.contract.count({
      where: {
        status: 'CREATED',
      },
    });

    const activeCount = await prisma.contract.count({
      where: {
        status: 'ACTIVE',
      },
    });

    const completedCount = await prisma.contract.count({
      where: {
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({
      created: createdCount,
      active: activeCount,
      completed: completedCount,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contract status counts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
