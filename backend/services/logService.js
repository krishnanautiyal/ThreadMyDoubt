// services/logService.js

const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/activity.log');

// 🔹 Get log file path
exports.getLogFilePath = () => logFilePath;

// 🔹 Check if file exists
exports.logFileExists = () => fs.existsSync(logFilePath);

// 🔹 Create read stream
exports.createLogStream = () => {
    return fs.createReadStream(logFilePath);
};

// 🔹 Read and parse logs
exports.readLogs = () => {
    if (!fs.existsSync(logFilePath)) {
        return [];
    }

    const data = fs.readFileSync(logFilePath, 'utf8');

    const logs = data
        .trim()
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return {
                    event: 'UNKNOWN',
                    message: line,
                    time: new Date()
                };
            }
        })
        .reverse();

    return logs;
};

// 🔹 Clear logs
exports.clearLogs = () => {
    fs.writeFileSync(logFilePath, '');
};