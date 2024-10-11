import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);
  const monthToInt = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  };
  
  const monthInt = monthToInt[month]; 
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/bar-chart', {
          params: { month: monthInt }
        });
        setBarChartData(res.data);
      } catch (error) {
        console.error('Error fetching bar chart data', error);
      }
    };
    fetchBarChartData();
  }, [month]);

  const data = {
    labels: barChartData.map((item) => item.range),
    datasets: [
      {
        label: 'Number of items',
        data: barChartData.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Items by Price Range',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
