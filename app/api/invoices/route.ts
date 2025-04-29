import { NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    investorId,
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
  //       cur: { name: string; price: string; quantity: string; total: string }
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

  const invoice = await prisma.contract.create({
    data: {
      userId: currentUser.id,
      investorId: investorId.id,
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
