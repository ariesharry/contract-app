import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, role, password } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
