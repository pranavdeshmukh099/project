const express = require('express');
const { seedData, listTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData } = require('./transactionController');

const router = express.Router();

router.get('/seed-data', seedData);
router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined', getCombinedData);

module.exports = router;
