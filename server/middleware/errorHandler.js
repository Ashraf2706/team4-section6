const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Server Error',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
};

module.exports = errorHandler;