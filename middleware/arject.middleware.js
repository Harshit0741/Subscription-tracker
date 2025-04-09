import aj from "../config/arject.js";

const arjectMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        // Correct check for denial
        if (decision.conclusion === "DENY") {
            const reasonType = decision.reason?.type || "Unknown";
            const reasonMessage = decision.reason?.message || "Access denied";

            if (reasonType === "RATE_LIMIT") {
                return res.status(429).json({ error: reasonMessage });
            }

            if (reasonType === "BOT") {
                return res.status(403).json({ error: reasonMessage });
            }

            return res.status(403).json({ error: `Access denied: ${reasonType}` });
        }

        // Request allowed
        return next();
    } catch (err) {
        console.error(`Arcjet middleware error: ${err}`);
        return next(err);
    }
};

export default arjectMiddleware;
