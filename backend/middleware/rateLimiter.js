const requests = new Map();

export const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    
    if (requests.has(ip)) {
        const userRequests = requests.get(ip);
        // Clean old requests
        const recentRequests = userRequests.filter(time => time > windowStart);
        
        if (recentRequests.length >= 5) { // 5 requests per minute
            return res.status(429).json({
                success: false,
                message: "Too many requests, please try again later"
            });
        }
        
        recentRequests.push(now);
        requests.set(ip, recentRequests);
    } else {
        requests.set(ip, [now]);
    }
    
    next();
};