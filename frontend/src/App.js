import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import './App.css';
function App() {
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  // Fetch Transactions
  const fetchTransactions = async (search = '', page = 1, month = 'March') => {
    try {
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
      const res = await axios.get('http://localhost:3000/api/transactions', {
        params: { search, page, month }
      });
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions', error);
      if (error.code === 'ERR_NETWORK') {
      // Optionally implement a retry mechanism
      console.log('Retrying request...');
      setTimeout(fetchTransactions, 5000); // Retry after 5 seconds
    }
    }
  };

  // Fetch data when month or page changes
  useEffect(() => {
    fetchTransactions(search, page, month);
  }, [search, page, month]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleNextPage = () => {
    window.alert(totalPages);
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>
      <div>
        <label>Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((mon) => (
            <option key={mon} value={mon}>{mon}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search transactions"
          value={search}
          onChange={handleSearch}
        />

        <TransactionsTable transactions={transactions} />
        <button onClick={handlePrevPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>

          <h1>Statistics - {month}</h1>
         <StatisticsBox month={month} /><br></br>
         <h1>Bar Chart {month}</h1>
        <BarChart month={month} /> 
      </div>
    </div>
  );
}

export default App;
