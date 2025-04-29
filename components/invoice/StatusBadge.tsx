import { cn } from "@/utils/utils";
import React from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div
      className={cn(
        "row-span-2 sm:row-span-1 flex justify-center items-center px-4 py-2.5 capitalize rounded-md",
        status === "created" && "text-[#FF8F00] bg-[#FF8F00]/5", // Orange text and background for "created"
        status === "completed" && 
          "dark:text-[#DFE3FA] dark:bg-[#DFE3FA]/5 text-[#373B53] bg-[#373B53]/5", // Black for "completed"
        status === "active" && "text-[#33D69F] bg-[#33D69F]/5", // Green text and background for "active"
        status === "rejected" && "text-[#FF6347] bg-[#FF6347]/5", // Red-Orange text and background for "rejected"
      )}
    >
      <span
        className={cn(
          "inline-block mr-3 h-2 w-2 rounded-full",
          status === "created" && "bg-[#FF8F00]", // Orange for "created"
          status === "completed" && "bg-[#000000]", // Black for "completed"
          status === "active" && "bg-[#33D69F]", // Green for "active"
          status === "rejected" && "bg-[#FF6347]", // Red-Orange for "rejected"
        )}
      ></span>
      <span className="pt-1">{status}</span>
    </div>
  );
};

export default StatusBadge;
