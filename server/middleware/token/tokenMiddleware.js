const asyncHandler = require("express-async-handler");
const CustomError = require("../../helper/error/CustomError");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;


const tokenVerify = asyncHandler(async (req, res, next) => {
  if (!isTokenIncluded(req)) throw new CustomError("You are not authorized to access this page", 403);
  const token = getTokenFromHeader(req);

  jwt.verify(token, JWT_SECRET_KEY, function (err, decoded) {
    if (err && err.message === "jwt expired") throw new CustomError('Access token expired',401);
    if (err) throw new CustomError("You are not authorized to access this page", 401);


    req.user = {
      name: decoded.name,
      username: decoded.username
    };
    next();
  })
});




const isTokenIncluded = req => req.headers.authorization && req.headers.authorization.startsWith("Bearer:");
const getTokenFromHeader = req => req.headers.authorization.split(" ")[1];

module.exports = {
  tokenVerify
};