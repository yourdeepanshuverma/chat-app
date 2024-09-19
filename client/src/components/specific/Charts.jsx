import React from 'react'
import { Line, Doughnut } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, ArcElement, Filler, PointElement, Tooltip, LineElement } from 'chart.js';
import { lightOrange, lightPurple, orange, purple } from '../constants/color';
import { getLast7Days } from '../lib/features';

ChartJS.register(
    CategoryScale,
    LinearScale,
    Legend,
    ArcElement,
    PointElement,
    Filler,
    LineElement,
    Tooltip
)

const lineChartOptions = {
    Response: 'true',
    animation: 'true',
    plugins: {
        Legend: {
            display: false
        },
        title: {
            display: false
        },
        Tooltip: {
            enabled: true
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            grid: {
                display: false
            },
            beginAtZero: true
        }
    }
}


const LineChart = ({ value = [] }) => {
    const data = {
        labels: getLast7Days(),
        datasets: [
            {
                label: 'First',
                data: value,
                fill: true,
                backgroundColor: lightPurple,
                borderColor: purple,
            },

        ]
    }
    return (
        <Line data={data} options={lineChartOptions} />
    )
}


const doughnutChartOptions = {
    Response: 'true',
    plugins: {
        legend: {
            display: false,
        }
    },
    cutout: 100
}

const DoughnutChart = ({ value = [], labels = [] }) => {
    const data = {
        labels,
        datasets: [
            {
                data: value,
                borderColor: 'rgb(75, 192, 192)',
                hoverBackgroundColor: [lightOrange, lightPurple],
                backgroundColor: [orange, purple],
                offset: 40
            }
        ]
    }
    return (
        <Doughnut style={{ zIndex: 10 }} data={data} options={doughnutChartOptions} />
    )
}

export {
    LineChart,
    DoughnutChart
}