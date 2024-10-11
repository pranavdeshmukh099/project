const axios = require('axios');
const Transaction = require('./transactionModel');

// Seed Data
const seedData = async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(data);
    res.send('Database seeded with data');
  } catch (error) {
    res.status(500).send('Error seeding data');
  }
};

// List Transactions
const listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const searchRegex = new RegExp(search, 'i');

  // Map month names to corresponding month numbers (1-12)
  const monthMap = {
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

  const monthInt = monthMap[month]; // Convert month name to the corresponding month number
  if (!monthInt) {
    return res.status(400).send('Invalid month name'); // Handle invalid month input
  }

  try {
    const transactions = await Transaction.aggregate([
      {
        $addFields: { saleMonth: { $month: "$dateOfSale" } } // Extract the month from dateOfSale
      },
      {
        $match: {
          saleMonth: monthInt, // Match transactions based on the selected month
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { price: search } // Match search on title, description, or price
          ]
        }
      },
      {
        $skip: (page - 1) * parseInt(perPage) // Pagination: skip the appropriate number of records
      },
      {
        $limit: parseInt(perPage) // Limit the number of records per page
      }
    ]);

    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
};


const getStatistics = async (req, res) => {
  const { month } = req.query;
  const monthInt = parseInt(month); // Convert the month string (e.g. "03") to an integer (1-12)

  try {
    // Aggregate total sales and sold items for the selected month (regardless of the year)
    const totalSales = await Transaction.aggregate([
      { 
        $addFields: { saleMonth: { $month: "$dateOfSale" } } // Extract the month from dateOfSale
      },
      { 
        $match: { saleMonth: monthInt, sold: true } // Match transactions where the month and sold status match
      },
      { 
        $group: { _id: null, totalAmount: { $sum: '$price' }, totalItems: { $sum: 1 } } // Calculate total amount and total sold items
      }
    ]);

    // Count not sold items for the selected month (regardless of the year)
    const notSoldItems = await Transaction.aggregate([
      {
        $addFields: { saleMonth: { $month: "$dateOfSale" } } // Extract the month from dateOfSale
      },
      { 
        $match: { saleMonth: monthInt, sold: false } // Match transactions where the month and sold status are false
      },
      { 
        $count: "totalNotSoldItems" // Count the number of not sold items
      }
    ]);

    res.json({
      totalSales: totalSales[0]?.totalAmount || 0,
      totalSoldItems: totalSales[0]?.totalItems || 0,
      totalNotSoldItems: notSoldItems[0]?.totalNotSoldItems || 0
    });
  } catch (error) {
    res.status(500).send('Error fetching statistics');
  }
};



// Get Bar Chart Data
const getBarChartData = async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2021-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);
  const monthNumber = month.padStart(2, '0'); 
  const ranges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity }
  ];

  try {
    const barChartData = await Promise.all(ranges.map(async (range) => {
      const count = await Transaction.countDocuments({
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber]
        },

        // dateOfSale: { $gte: startDate, $lte: endDate },
        price: { $gte: range.min, $lte: range.max }
      });
      return { range: range.range, count };
    }));

    res.json(barChartData);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data');
  }
};

module.exports = { getBarChartData };



// Get Pie Chart Data
const getPieChartData = async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2021-${month}-01`);
  const endDate = new Date(`2022-${month}-31`);

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json(pieChartData.map(item => ({ category: item._id, count: item.count })));
  } catch (error) {
    res.status(500).send('Error fetching pie chart data');
  }
};

// Combined API
const getCombinedData = async (req, res) => {
  try {
    const statistics = await getStatistics(req, res);
    const barChart = await getBarChartData(req, res);
    const pieChart = await getPieChartData(req, res);
    res.json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).send('Error fetching combined data');
  }
};

// Export all controller functions
module.exports = {
  seedData,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData
};
