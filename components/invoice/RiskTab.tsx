import React from "react";

const RiskChart = () => {
  const riskValue = 65; // dummy nilai risiko, 1 - 100

  const getRiskLabel = (value: number) => {
    if (value <= 33) return "Rendah";
    if (value <= 66) return "Menengah";
    return "Tinggi";
  };

  const riskLabel = getRiskLabel(riskValue);

  return (
    <div className="p-6 bg-white dark:bg-[#1E2139] rounded-md">
      <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">
        Tingkat Risiko Investasi
      </h2>
      <svg width="100%" height="80">
        {/* Background bars */}
        <rect x="0" y="30" width="33%" height="20" fill="#a8e6cf" />
        <rect x="33%" y="30" width="33%" height="20" fill="#ffd3b6" />
        <rect x="66%" y="30" width="34%" height="20" fill="#ffaaa5" />

        {/* Labels */}
        <text x="10%" y="25" fontSize="14" fill="#333">Rendah</text>
        <text x="43%" y="25" fontSize="14" fill="#333">Menengah</text>
        <text x="78%" y="25" fontSize="14" fill="#333">Tinggi</text>

        {/* Risk pointer */}
        <line
          x1={`${riskValue}%`}
          y1="20"
          x2={`${riskValue}%`}
          y2="70"
          stroke="black"
          strokeWidth="2"
        />
        <circle cx={`${riskValue}%`} cy="25" r="5" fill="black" />

        {/* Label nilai */}
        <text
          x={`${riskValue}%`}
          y="75"
          fontSize="12"
          fill="black"
          textAnchor="middle"
        >
          {riskValue} ({riskLabel})
        </text>
      </svg>
    </div>
  );
};

export default RiskChart;
