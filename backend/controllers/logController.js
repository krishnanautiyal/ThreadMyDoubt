// controllers/logController.js

const logService = require('../services/logService');
const { logEvent } = require('../utils/logger');

// 🔹 Download logs
exports.downloadLogs = (req, res) => {
    try {
        if (!logService.logFileExists()) {
            return res.status(404).json({
                success: false,
                error: 'Log file not found'
            });
        }

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename=activity.log');

        const stream = logService.createLogStream();

        stream.pipe(res);

        stream.on('error', (err) => {
            logEvent({
                event: 'SERVER_ERROR',
                username: null,
                title: `Log streaming failed: ${err.message}`,
                time: new Date()
            });

            if (!res.headersSent) {
                res.status(500).send('Server Error during streaming');
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🔹 View logs
exports.getLogs = (req, res) => {
    try {
        const logs = logService.readLogs();

        res.status(200).json({
            success: true,
            data: logs
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to read logs'
        });
    }
};

// 🔹 Clear logs
exports.clearLogs = (req, res) => {
    try {
        logService.clearLogs();

        logEvent({
            event: 'LOGS_CLEARED',
            username: req.user ? req.user.username : 'Admin',
            title: 'Log history was reset',
            time: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Logs cleared successfully'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to clear logs'
        });
    }
};