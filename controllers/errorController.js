const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  console.log('I am here inside handleCastError');
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value : ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // Loop through Errors and put them together
  const errors = Object.values(err.errors).map((el) => el.message);

  // separating array strings by '. '
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token is expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please, try later...!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // statusCode (if defined) or 500
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    // for Cast Error
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // for Duplicate Name
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // Checking for Validators
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    // JSON WEB TOKEN ERROR
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // JSON WEB TOKEN EXPIRED
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
