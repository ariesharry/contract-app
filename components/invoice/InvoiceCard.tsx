"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, add } from "date-fns";

import { SafeInvoice } from "@/types";
import { TERMS } from "@/enums";
import { ArrowRight } from "@/assets/icons";
import StatusBadge from "./StatusBadge";
import getShortId from "@/helpers/getShortId";

interface InvoiceCardProps {
  invoice: SafeInvoice;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    // Format date only on the client side after hydration
    const dueDate = new Date(invoice.startDate);
    const formatted = format(dueDate, "dd MMM yyyy");
    setFormattedDate(formatted);
  }, [invoice.startDate]);

  const status =
    invoice.status === "CREATED"
    ? "created"
    : invoice.status === "ACTIVE"
    ? "active"
    : invoice.status === "REJECTED"
    ? "rejected"
    : "completed";

  return (
    <Link
      href={`/invoices/${invoice.id}`}
      className="w-full bg-white dark:bg-[#1E2139] grid-cols-2 sm:grid-cols-[50px_110px_repeat(3,1fr)_20px] grid md:grid-cols-[80px_120px_repeat(3,1fr)_20px] items-center py-6 sm:py-4 px-6 md:px-8 rounded-md font-medium text-sm text-primary gap-1 sm:gap-4"
    >
      <div className="mb-6 font-bold uppercase sm:mb-0">
        <span className="text-[#7E88C3]">#</span>
        {getShortId(invoice.id)}
      </div>
      <span className="text-[#7E88C3] dark:text-[#DFE3FA]">
        Date {formattedDate ?? "loading..."}
      </span>
      <span className="mb-6 sm:mb-0 col-start-2 row-start-1 justify-self-end sm:justify-self-start sm:col-auto sm:row-auto text-[#858BB2] dark:text-[#FFFFFF]">
        {invoice.name}
      </span>
      <span className="col-start-1 row-start-3 text-base font-bold sm:col-auto sm:row-auto md:pr-5 sm:justify-self-end">
        RP {invoice.investmentAmount}
      </span>
      <StatusBadge status={status} />
      <span className="justify-center hidden sm:flex">
        <ArrowRight />
      </span>
    </Link>
  );
};

export default InvoiceCard;
