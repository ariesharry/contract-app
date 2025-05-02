import React from "react";

const ProfitChart = () => {
  // Dummy data
  const profitScenario = { investor: 70, partner: 30 }; // atau bisa ganti ke 60:40

  return (
    <div className="p-6 bg-white dark:bg-[#1E2139] rounded-md">
      <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">
        Estimasi Keuntungan
      </h2>

      <svg width="100%" height="60">
        {/* Investor */}
        <rect
          x="0"
          y="10"
          width={`${profitScenario.investor}%`}
          height="20"
          fill="#4caf50"
        />
        <text
          x={`${profitScenario.investor / 2}%`}
          y="25"
          fontSize="12"
          fill="white"
          textAnchor="middle"
        >
          Investor {profitScenario.investor}%
        </text>

        {/* Partner */}
        <rect
          x={`${profitScenario.investor}%`}
          y="10"
          width={`${profitScenario.partner}%`}
          height="20"
          fill="#2196f3"
        />
        <text
          x={`${profitScenario.investor + profitScenario.partner / 2}%`}
          y="25"
          fontSize="12"
          fill="white"
          textAnchor="middle"
        >
          Partner {profitScenario.partner}%
        </text>
      </svg>
    </div>
  );
};

export default ProfitChart;
