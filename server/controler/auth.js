const asyncHandler = require('express-async-handler');
const { Login } = require('../helper/valueControl/auth');
const CustomError = require('../helper/error/CustomError');
const User = require('../model/User');
const { generateToken } = require('../helper/token/token');
const { JWT_COOKIE_EXPIRE } = process.env;
const jwt = require('jsonwebtoken');
const { JWT_REFRESH_SECRET_KEY } = process.env;


/* LOGIN */
const login = asyncHandler(async (req, res, next) => {

  //get values from body
  const { username, password } = req.body;

  //give values to class
  const loginClass = new Login(username, password);

  //are there values? 
  if (!loginClass.validateInputs()) throw new CustomError('Check your Inputs', 400);

  //get values for check
  const values = loginClass.getForCheck();

  //find user from DB
  const user = await User
    .findOne({
      $or: [
        { username: values.username },
        { email: values.username }
      ]
    })
    .select("+password").populate({
      path: 'saved',
      populate: {
        path: 'userid',
        model: 'User'
      }
    });

  //if user is not founded
  if (!user) throw new CustomError('User is not founded. Please, type your username or email', 400);

  //if passwords do not match
  if (!loginClass.checkPasswords(user.password)) throw new CustomError('Password is wrong', 400);

  user.saved.reverse();

  //generate token
  const token = generateToken({
    name: user.name,
    username: user.username
  });

  //generate refresh token
  const refreshToken = generateToken({
    name: user.name,
    username: user.username,
    password:user.password
  }, 'refresh');




  res.cookie('token', token, {
    httpOnly: false,
    expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRE))
  });
  req.result = { status: true, body: { token, user, refreshToken } }
  next();
});
/* ***************************************************************** */



/* LOGOUT */
const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now())
    });
  req.result = {
    status: true,
    message: "Logout Successfull"
  }
  next();
});
/* ***************************************************************** */

/* REFRESH */
const refresh = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) throw new CustomError("Bad Request", 400);
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET_KEY);
    const newToken = generateToken({
      name: decoded.name,
      username: decoded.username
    });
    const user = await User
      .findOne({
        $or: [
          { username: decoded.username },
          { email: decoded.username }
        ],
        password:decoded.password
      }).populate({
        path: 'saved',
        populate: {
          path: 'userid',
          model: 'User'
        }
      });

    user.saved.reverse();
    req.result = { status: true, body: { token: newToken, user } };
    return next();
  } catch (err) {
    throw new CustomError("Please login again", 401);
  }
});
/* ***************************************************************** */

module.exports = {
  login, logout, refresh
}