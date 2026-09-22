import React from "react";
import "./chartConfig";
import { Bar } from "react-chartjs-2";

export default function SubscriptionsChart({ data }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "الاشتراكات النشطة",
        data: data?.values || [],
        backgroundColor: "#095b68",
        borderRadius: 8,
        hoverBackgroundColor: "#0EA5C6",
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
      <Bar data={chartData} options={options} />
    </div>
  );
}
