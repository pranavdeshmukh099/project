import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatisticsBox = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
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
    const fetchStatistics = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/statistics', {
          params: { month:monthInt }
        });
        setStatistics(res.data);
      } catch (error) {
        console.error('Error fetching statistics', error);
      }
    };
    fetchStatistics();
  }, [month]);

  return (
    <div className="statistics-box">
      <h3>Statistics for {month}</h3>
      <p>Total Sales: ${statistics.totalSales}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default StatisticsBox;
