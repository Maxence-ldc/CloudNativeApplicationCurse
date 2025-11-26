const { v4: uuidv4 } = require('uuid');
const { apiLogger } = require('../utils/logger');

const requestLogger = (req, res, next) => {
    // Get X-Request-Id from header, or generate one with backend prefix if not present
    const incomingRequestId = req.get('X-Request-Id');
    const requestId = incomingRequestId || `backend-${uuidv4()}`;
    req.requestId = requestId;

    // Add X-Request-Id to the response headers for traceability
    res.setHeader('X-Request-Id', requestId);

    // Capture the start time
    const startTime = Date.now();

    // Store the original end function
    const originalEnd = res.end;

    // Override the end function to log after response is sent
    res.end = function (...args) {
        // Calculate response time
        const responseTime = Date.now() - startTime;

        // Log the request details
        apiLogger.info({
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            status: res.statusCode,
            requestId: requestId,
            responseTime: `${responseTime}ms`,
            userAgent: req.get('user-agent'),
            ip: req.ip || req.connection.remoteAddress
        });

        // Call the original end function
        originalEnd.apply(res, args);
    };

    next();
};

module.exports = requestLogger;
