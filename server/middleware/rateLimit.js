// Simple in-memory rate limiter
const rateLimitStore = new Map();

/**
 * Rate limit middleware - 1 roast per minute per IP
 */
function rateLimitMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute

    if (rateLimitStore.has(ip)) {
        const lastRequest = rateLimitStore.get(ip);
        const timeSinceLastRequest = now - lastRequest;

        if (timeSinceLastRequest < windowMs) {
            const secondsRemaining = Math.ceil((windowMs - timeSinceLastRequest) / 1000);
            return res.status(429).json({
                error: '🔥 Too many roasts! Cool down.',
                message: `Please wait ${secondsRemaining} seconds before starting another battle.`,
                retryAfter: secondsRemaining
            });
        }
    }

    rateLimitStore.set(ip, now);
    next();
}

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    const windowMs = 60 * 1000;

    for (const [ip, timestamp] of rateLimitStore.entries()) {
        if (now - timestamp > windowMs) {
            rateLimitStore.delete(ip);
        }
    }
}, 5 * 60 * 1000);

module.exports = rateLimitMiddleware;
