const CustomError = require("../../helper/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
  let customError = err;

  if (customError.name == "CastError") {
    customError = new CustomError("Bad Request", 400);
  }
  if (customError.code == 11000) {
    let objectKeys = Object.keys(customError.keyPattern);
    customError.message = `The ${objectKeys[0]} is already used`;
    customError.status = 400;
  }

  res
    .status(customError.status || 500)
    .json({
      status: false,
      message: customError.message
    })
}

module.exports = customErrorHandler;