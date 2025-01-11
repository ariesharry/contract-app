import prisma from "@/libs/prismadb";

import getCurrentUser from "./getCurrentUser";
import { Status } from "@prisma/client";

export interface IInvoicesParams {
  draft?: string;
  pending?: string;
  paid?: string;
}

export default async function getInvoices(params: IInvoicesParams) {
  try {
    const { draft, pending, paid } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    let query: any = {};
    query.userId = currentUser.id;

    const statusArray = [];

    if (!draft) {
      statusArray.push({ status: Status.CREATED });
    }

    if (!pending) {
      statusArray.push({ status: Status.CREATED });
    }

    if (!paid) {
      statusArray.push({ status: Status.ACTIVE });
    }

    if (paid || pending || draft) {
      query.OR = statusArray;
    }

    const invoices = await prisma.contract.findMany({
      where: query,
      include: {
        profitRecords: true,
      },
    });

    const safeInvoices = invoices.map((invoice) => ({
      ...invoice,
      invoiceDate: invoice.endDate.toString(),
      createdAt: invoice.createdAt.toString(),
      updatedAt: invoice.updatedAt.toString(),
    }));

    return safeInvoices;
  } catch (error: any) {
    throw new Error(error);
  }
}
