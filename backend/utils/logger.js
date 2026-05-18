const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/activity.log');

/**
 * Log an event to activity.log in a structured format
 * @param {Object} logData - The data to log
 * @param {string} logData.event - The type of event (e.g., POST_CREATION)
 * @param {string} logData.username - Username of the user (or 'System')
 * @param {string} [logData.title] - Optional title of the content
 * @param {Date} [logData.time] - Optional timestamp (defaults to current date)
 */
const logEvent = (logData) => {
  const structuredLog = {
    event: logData.event,
    username: logData.username || 'System',
    title: logData.title || '',
    time: logData.time || new Date()
  };

  const logLine = JSON.stringify(structuredLog) + '\n';

  // Asynchronous logging using fs.appendFile
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error('Failed to write log to file:', err);
    }
  });
};

module.exports = { logEvent };
