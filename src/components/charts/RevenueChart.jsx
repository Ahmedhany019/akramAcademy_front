import React from "react";
import "./chartConfig";
import { Line } from "react-chartjs-2";

export default function RevenueChart({ data }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "الإيرادات (ج.م)",
        data: data?.values || [],
        fill: true,
        backgroundColor: "rgba(14, 165, 198, 0.1)",
        borderColor: "#0EA5C6",
        pointBackgroundColor: "#095b68",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#095b68",
        tension: 0.35,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        rtl: true,
        titleFont: { family: "Tajawal" },
        bodyFont: { family: "Tajawal" },
        backgroundColor: "#095b68",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          font: { family: "Tajawal" },
          color: "#6B7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { family: "Tajawal" },
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="w-full h-72">
      <Line data={chartData} options={options} />
    </div>
  );
}
