// A simple logger middleware to help beginners understand Express request pipeline
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} request to ${req.originalUrl}`);
  next();
};

module.exports = logger;
