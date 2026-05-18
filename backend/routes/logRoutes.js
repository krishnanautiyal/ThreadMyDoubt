const express = require('express');
const router = express.Router();
const { downloadLogs, getLogs, clearLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

// Base route for viewing logs
router.get('/', protect, getLogs);

// Route for streaming/downloading logs
router.get('/download', protect, downloadLogs);

// Route for clearing logs
router.delete('/clear', protect, clearLogs);

module.exports = router;
