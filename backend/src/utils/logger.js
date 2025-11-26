const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create a logger for API requests
const apiLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: path.join(logsDir, 'api-requests.log'),
            maxsize: 10485760, // 10MB
            maxFiles: 5,
        })
    ]
});

// Also log to console in development
if (process.env.NODE_ENV !== 'production') {
    apiLogger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = { apiLogger };
