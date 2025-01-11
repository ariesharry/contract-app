import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { Status } from "@prisma/client";

interface IParams {
  invoiceId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { invoiceId } = params;

  const invoice = await prisma.contract.updateMany({
    where: {
      id: invoiceId,
      userId: currentUser.id,
    },
    data: {
      status: Status.ACTIVE,
    },
  });

  return NextResponse.json(invoice);
}

export async function PATCH(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { invoiceId } = params;

  const body = await request.json();

  const {
    investorId,
    managerId,
    name,
    description,
    startDate,
    endDate,
    investmentAmount,
    profitSharingRatio,
    contractFileUrl,
    status,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // const total = items
  //   .reduce(
  //     (
  //       acc: number,
  //       cur: {
  //         name: string;
  //         price: string;
  //         quantity: string;
  //         total: string;
  //       }
  //     ) => acc + +cur.total,
  //     0
  //   )
  //   .toFixed(2)
  //   .toString();

  // Ensure that investmentAmount is a valid float
  const parsedInvestmentAmount = parseFloat(investmentAmount);
  if (isNaN(parsedInvestmentAmount)) {
    return NextResponse.error();  // Return an error if it's not a valid number
  }

  // Ensure that profitSharingRatio is a valid float
  const parsedProfitSharingRatio = parseFloat(profitSharingRatio);
  if (isNaN(parsedProfitSharingRatio)) {
    return NextResponse.error();  // Return an error if it's not a valid number
  }

  const invoice = await prisma.contract.update({
    where: {
      id: invoiceId,
    },
    data: {
      investorId: investorId.value,
      managerId,
      name,
      description,
      startDate,
      endDate,
      investmentAmount: parsedInvestmentAmount,
      profitSharingRatio: parsedProfitSharingRatio,
      contractFileUrl,
      status: status,
    },
  });

  return NextResponse.json(invoice);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { invoiceId } = params;

  if (!invoiceId || typeof invoiceId !== "string") {
    throw new Error("Invalid ID");
  }

  const invoice = await prisma.contract.deleteMany({
    where: {
      id: invoiceId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(invoice);
}
