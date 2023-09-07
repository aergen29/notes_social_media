const rateLimit = require("express-rate-limit");
const limiter = (windowMs = 60 * 1000, max = 3, minute = 1) => rateLimit({
    windowMs, // 1 minute
    max, // limit each IP to 3 requests per windowMs
    message: `Too much attempt, please try again after ${minute} minutes`
});

module.exports = limiter;