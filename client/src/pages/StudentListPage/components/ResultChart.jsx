/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register chart components and plugin
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

// 🎨 Dynamic bar color based on marks
const getBarColor = mark => {
  if (mark >= 90) return "#FFD700"; // Gold for highest
  if (mark >= 33) return "#22c55e"; // Green for pass
  return "#ef4444"; // Red for fail
};

// 📊 Letter Grade Calculator
const getGrade = avg => {
  if (avg >= 90) return "A+";
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  if (avg >= 33) return "E";
  return "F";
};

const ResultChart = ({ resultData, darkMode = false }) => {
  const labels = Object.keys(resultData);
  const marks = labels.map(subject => Number(resultData[subject]));
  const maxMark = Math.max(...marks);
  const avgMark = (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1);
  const totalMark = marks.reduce((a, b) => a + b, 0);
  const avgGrade = getGrade(avgMark);

  const chartData = {
    labels,
    datasets: [
      {
        label: "প্রাপ্ত নম্বর",
        data: marks,
        backgroundColor: marks.map(getBarColor),
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `গড়: ${avgMark} (${avgGrade}) | মোট: ${totalMark}`,
        font: { size: 16 },
        color: darkMode ? "#f1f5f9" : "#1f2937",
        padding: { bottom: 20 }
      },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.parsed.y} নম্বর`
        }
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: darkMode ? "#e2e8f0" : "#1e293b",
        font: { weight: "bold" },
        formatter: value => (value === maxMark ? `⭐ ${value}` : value)
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 5,
          precision: 0,
          color: darkMode ? "#94a3b8" : "#475569",
          font: { size: 12 }
        },
        grid: {
          color: darkMode ? "#334155" : "#e2e8f0",
          drawTicks: true
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: darkMode ? "#cbd5e1" : "#334155",
          font: { size: 14 }
        }
      }
    }
  };

  return (
    <div
      style={{
        background: darkMode ? "#1e293b" : "#fff",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: darkMode
          ? "0 2px 8px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.05)",
        width: "100%",
        maxWidth: "350px",
        height: "340px",
        color: darkMode ? "#e2e8f0" : "#1e293b"
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ResultChart;
