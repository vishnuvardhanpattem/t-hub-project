

import React, { useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './css/WeeklyChart.css';  // Optional: For any additional custom styling

// Register necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklyChart = ({ weeklyData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('weeklyChart').getContext('2d');

        // Create the chart
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weeklyData.map((data, index) => `Day ${index + 1}`),
                datasets: [
                    {
                        label: 'Stress Level',
                        data: weeklyData.map(data => data.stress),
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',  // Thicker color
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        barThickness: 30,  // Thicker bars
                        hoverBackgroundColor: 'rgba(255, 99, 132, 0.9)', // Hover effect
                    },
                    {
                        label: 'Sleep Hours',
                        data: weeklyData.map(data => data.sleep),
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        barThickness: 30,  // Thicker bars
                        hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Days of the Week',
                            font: {
                                size: 16
                            }
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Level/Hours',
                            font: {
                                size: 16
                            }
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Stress and Sleep Comparison Over the Week',
                        font: {
                            size: 24
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        bodyFont: {
                            size: 14
                        },
                        titleFont: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                // Animation for smooth transition from 0 to values
                animation: {
                    duration: 1500,  // Animation duration in ms
                    easing: 'easeOutBounce',  // Smooth easing effect
                    onComplete: () => {
                        // Optionally, add more effects once the animation is complete
                    }
                },
                elements: {
                    bar: {
                        backgroundColor: function (context) {
                            // Optional: Make colors dynamic based on value
                            const value = context.dataset.data[context.dataIndex];
                            return value < 5 ? 'rgba(255, 159, 64, 0.8)' : 'rgba(75, 192, 192, 0.8)';
                        },
                        borderWidth: 1,
                        hoverBorderColor: 'black',
                        hoverBorderWidth: 2
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [weeklyData]);

    return (
        <div className="chart-container">
            <canvas id="weeklyChart"></canvas>
        </div>
    );
};

export default WeeklyChart;

