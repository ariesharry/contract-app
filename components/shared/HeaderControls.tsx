"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "@/assets/icons";
import Filter from "./Filter";
import { SafeUser } from "@/types";

import { useAppDispatch } from "@/libs/redux/hooks";
import { onOpen as onInvoiceOpen } from "@/libs/redux/features/invoice-slice";
import { onOpen as onLoginModalOpen } from "@/libs/redux/features/modals/login-modal-slice";

interface HeaderControlsProps {
  currentUser?: SafeUser | null;
  numOfInvoices: number;
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  currentUser,
  numOfInvoices,
}) => {
  const dispatch = useAppDispatch();

  const [statusCounts, setStatusCounts] = useState({
    created: 0,
    active: 0,
    completed: 0,
  });

  useEffect(() => {
    async function fetchStatusCounts() {
      try {
        const response = await fetch('/api/infoStatus');
        const data = await response.json();
        setStatusCounts(data);
      } catch (error) {
        console.error("Failed to fetch status counts:", error);
      }
    }

    fetchStatusCounts();
  }, []);

  const createNewInvoice = useCallback(() => {
    if (!currentUser) {
      return dispatch(onLoginModalOpen());
    }

    dispatch(onInvoiceOpen());
  }, [currentUser, dispatch]);

  const statuses = [
    { title: "Active", count: statusCounts.active, color: "bg-green-100 text-green-700" },
    { title: "Created", count: numOfInvoices, color: "bg-yellow-100 text-yellow-700" },
    { title: "Completed", count: statusCounts.completed, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="z-10 flex flex-col gap-6">
      {/* Header Section */}
      <h1 className="text-[20px] sm:text-[32px] font-bold text-primary">
        Mudharabah Financing System
      </h1>

      {/* Status Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {statuses.map((status) => (
          <div
            key={status.title}
            className={`p-4 rounded-lg shadow-sm border ${status.color}`}
          >
            <h2 className="text-lg font-semibold">{status.title}</h2>
            <p className="text-2xl font-bold">{status.count}</p>
          </div>
        ))}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-6">
        <p className="text-xs font-medium text-secondary">
          {numOfInvoices === 0
            ? "No Contract"
            : `There are ${numOfInvoices} total Contracts`}
        </p>
        <div className="flex items-center gap-4 sm:gap-6">
          <Filter />
          <button
            onClick={createNewInvoice}
            className="flex gap-2 sm:gap-4 items-center p-1.5 pr-3 sm:p-2 sm:pr-4 text-xs font-bold capitalize rounded-full transition text-white bg-[#7C5DFA] hover:bg-[#9277FF]"
          >
            <span className="p-2.5 bg-white rounded-full">
              <Plus />
            </span>
            <div>
              New <span className="hidden sm:inline">Contract</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderControls;
