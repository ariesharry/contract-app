"use client";

import { add, format } from "date-fns";

import { SafeInvoice } from "@/types";
import useCountries from "@/hooks/useCountries";
import { TERMS } from "@/enums";
import getShortId from "@/helpers/getShortId";

interface InvoiceInfoProps {
  invoice: SafeInvoice;
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({ invoice }) => {
  const { getByValue } = useCountries();

  const invoiceDate = new Date(invoice.startDate);
  const dueDate = new Date(invoice.endDate);

  return (
    <div className="overflow-y-auto rounded-md">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-2 px-8 py-5 bg-[#FFFFFF] dark:bg-[#1E2139] rounded-md text-[#7E88C3] dark:text-[#DFE3FA] font-medium">
        {/* Contract Details */}
        <div className="flex flex-col gap-2">
          <div className="text-base font-bold uppercase text-primary">
            <span className="text-[#7E88C3]">Contract ID:</span> {getShortId(invoice.id)}
          </div>
          <div>
            <span className="font-medium">Name: </span>{invoice.name || "N/A"}
          </div>
          <div>
            <span className="font-medium">Description: </span>{invoice.description || "N/A"}
          </div>
        </div>

        {/* Parties Involved */}
        <div className="flex flex-col col-start-1 gap-1 sm:text-right sm:col-start-3">
          <div className="flex flex-col gap-1">
            <span className="font-medium">Mudharib: </span>
            <span className="font-bold">{invoice.userName || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium">Shahibul Mal: </span>
            <span className="font-bold">{invoice.investorName || "N/A"}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-col col-start-1 gap-8 sm:col-start-auto">
          <div className="flex flex-col gap-3">
            <span className="font-medium">Start Date</span>
            <span className="text-base font-bold text-primary">
              {format(invoiceDate, "dd MMM yyyy")}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-medium">End Date</span>
            <span className="text-base font-bold text-primary">
              {format(dueDate, "dd MMM yyyy")}
            </span>
          </div>
        </div>

        {/* Financial Details */}
        <div className="flex flex-col gap-2 justify-self-end sm:justify-self-start">
          <div>
            <span className="font-medium">Amount (IDR): </span>{invoice.investmentAmount.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Profit Sharing Ratio: </span>{invoice.profitSharingRatio}%
          </div>
          <div>
            <span className="font-medium">Contract File: </span>
            {invoice.contractFileUrl ? (
              <a 
              href={`/uploads/${invoice.contractFileUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary underline"
              >
                View Contract
              </a>
            ) : (
              "N/A"
            )}
          </div>
        </div>

        {/* Investment Amount */}
        <div className="p-6 bg-[#373B53] dark:bg-[#0C0E16] flex flex-col text-white align-middle rounded-md justify-center">
          <div className="font-medium">Investment Amount (IDR)</div>
          <div className="text-2xl font-bold">{invoice.investmentAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceInfo;
