/* eslint-disable react/prop-types */
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AttendanceChart = ({ attendanceData }) => {
    const labels = Object.keys(attendanceData);
    const presentDays = labels.map(month => attendanceData[month]?.presentDays || 0);
    const workingDays = labels.map(month => {
        const { calendarDays = 0, holidays = 0 } = attendanceData[month] || {};
        return calendarDays - holidays;
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: "উপস্থিত দিন",
                data: presentDays,
                borderColor: "#3b82f6",
                backgroundColor: "#dbeafe",
                tension: 0.4,
                fill: true,
                pointBackgroundColor: "#1d4ed8",
            },
            {
                label: "কার্যদিবস (ছুটি বাদে)",
                data: workingDays,
                borderColor: "#facc15",
                backgroundColor: "#fef9c3",
                tension: 0.4,
                fill: false,
                borderDash: [5, 5],
                pointBackgroundColor: "#ca8a04",
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: context => `${context.dataset.label}: ${context.raw} দিন`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'দিন সংখ্যা',
                },
                ticks: {
                    stepSize: 5,
                    callback: value => `${value} দিন`
                }
            }
        }
    };

    return <Line data={chartData} options={chartOptions} />;
};

export default AttendanceChart;
