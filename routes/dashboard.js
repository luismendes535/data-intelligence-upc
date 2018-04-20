const express = require('express');
const router = express.Router();

let dashboardController = require('../controllers/dashboardController');

// Get Homepage
router.get('/dashboards/:collection',dashboardController.loadDashboard);

// Get chart data based on user input
router.get('/dashboards/:collection/chartData', dashboardController.getChartData);

module.exports = router;
