"use client";

import Link from "next/link";

import { SafeInvoice } from "@/types";

import { ArrowLeft } from "@/assets/icons";
import InvoiceHead from "@/components/invoice/InvoiceHead";
import InvoiceInfo from "@/components/invoice/InvoiceInfo";
import InvoiceActionButtons from "@/components/invoice/InvoiceActionButtons";

interface InvoiceClientProps {
  invoice: SafeInvoice;
}

const InvoiceClient: React.FC<InvoiceClientProps> = ({ invoice }) => {
  const status =
    invoice.status === "CREATED"
    ? "created"
    : invoice.status === "ACTIVE"
    ? "active"
    : invoice.status === "REJECTED"
    ? "rejected"
    : "completed";


  return (
    <div className="flex flex-col h-full gap-6 text-sm font-bold text-primary">
      <Link href="/" className="flex items-center self-start gap-5 p-2">
        <ArrowLeft />
        <span>Go back</span>
      </Link>
      <InvoiceHead status={status}>
        <InvoiceActionButtons invoice={invoice} status={status} />
      </InvoiceHead>
      <InvoiceInfo invoice={invoice} />
      {/* Buttons for mobiles */}
      <div className="flex justify-between flex-1 sm:hidden px-6 py-4 bg-[#FFFFFF] dark:bg-[#1E2139] items-center rounded-t-md">
        <InvoiceActionButtons invoice={invoice} status={status} />
      </div>
    </div>
  );
};

export default InvoiceClient;
