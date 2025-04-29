import prisma from "@/libs/prismadb";

import getCurrentUser from "./getCurrentUser";
import { Status } from "@prisma/client";

export interface IInvoicesParams {
  draft?: string;
  created?: string;
  paid?: string;
}

export default async function getInvoices(params: IInvoicesParams) {
  try {
    const { draft, created, paid } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    let query: any = {};
    // Filter berdasarkan peran pengguna
    if (currentUser.role === "Mudharib") {
      // Jika Mudharib, cari kontrak berdasarkan userId
      query.userId = currentUser.id;
    } else if (currentUser.role === "Shahibul Mal") {
      // Jika Shaibul Mal, cari kontrak berdasarkan investorId
      query.investorId = currentUser.id;
    }

    const statusArray = [];

    if (!draft) {
      statusArray.push({ status: Status.CREATED });
    }

    if (!created) {
      statusArray.push({ status: Status.CREATED });
    }

    if (!paid) {
      statusArray.push({ status: Status.ACTIVE });
    }

    if (paid || created || draft) {
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
