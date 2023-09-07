const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { Signup, Update } = require('../helper/valueControl/user');
const CustomError = require('../helper/error/CustomError');
const User = require('../model/User');
const { generateToken } = require('../helper/token/token');
const sendMail = require('../helper/mailer/resetPassword');
const sendHelloMail = require('../helper/mailer/helloNotes');
const { checkHashCompare } = require('../helper/general/generalHelpers');
const { JWT_COOKIE_EXPIRE } = process.env;



/* SIGNUP */

const signup = asyncHandler(async (req, res, next) => {
  //get values from body
  const { name, username, password, email } = req.body;

  //give values to class
  const signupClass = new Signup(name, username, email, password);

  //are there values? 
  if (!signupClass.validateInputs()) throw new CustomError('Check your Inputs', 400);

  //get values for save
  const values = signupClass.getForSave();

  //save values 
  const user = await User.create(values);


  //sending mail
  sendHelloMail(user);

  res.status(200);
  req.result = { status: true, body: user };
  next();
});

/* ***************************************************************** */



/* PROFILE */

const profile = asyncHandler(async (req, res, next) => {
  //get values from body
  const { name, username } = req.user;

  //find user from DB
  const user = await User.findOne({ username, name });


  //if user is not founded
  if (!user) throw new CustomError("You are not authorized to access this page. Please login", 401);


  res.status(200);
  req.result = { status: true, body: { user } };
  next();
});
/* ***************************************************************** */

/* VISIT */

const visit = asyncHandler(async (req, res, next) => {
  //get values from body
  const { username } = req.body;

  //control body
  if (!username) throw new CustomError("Bad request", 400);

  //find user from DB
  const user = await User.findOne({ username, stopped: false });


  //if user is not founded
  if (!user) throw new CustomError("This user is not founded", 401);



  res.status(200);
  req.result = { status: true, body: { user } };
  next();
});
/* ***************************************************************** */


/* FORGET */

const forget = asyncHandler(async (req, res, next) => {
  //get values from body
  const { username } = req.body;

  //control body
  if (!username) throw new CustomError("Bad request", 400);

  //find user from DB
  const user = await User.findOne({
    $or: [
      { username: username },
      { email: username }
    ]
  });

  //if user is not founded
  if (!user) throw new CustomError("This user is not founded", 401);

  //make password token
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  //update user
  await user.save();



  try {
    //sending mail
    sendMail(resetPasswordToken, user);
    res.status(200);
    req.result = { status: true, message: 'Token is sent your email' };
    next();
  } catch {
    //if sending mail become unsuccessful 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    throw new CustomError("Email could not be sent your email.", 500);
  }
});
/* ***************************************************************** */


/* RESET PASSWORD */
const resetPassword = asyncHandler(async (req, res, next) => {
  //get values from params
  const { token } = req.params;

  //control params
  if (!token || token == "") throw new CustomError("Bad request", 400);

  //find user from DB
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  });

  //if token is not founded
  if (!user) throw new CustomError("This token is not founded", 401);

  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  //update values
  const editedUser = await user.save();

  //if there is an error
  if (!editedUser) throw new CustomError();

  //generate Token   
  const jwtToken = generateToken({
    name: user.name,
    username: user.username
  });

  res
    .status(200)
    .cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRE))
    });
  req.result = { status: true, body: { user, token: jwtToken } };
  next();
});
/* ***************************************************************** */

/* RESET PASSWORD UPDATE */
const resetPasswordUpdate = asyncHandler(async (req, res, next) => {
  //get values from body
  const { newPassword } = req.body;

  //get values from req
  const { name, username } = req.user;

  //control values
  if (!newPassword) throw new CustomError("Bad request", 400);


  //find user from DB
  const user = await User.findOne({ name, username });

  //if user is not founded
  if (!user) throw new CustomError("This user is not founded", 401);

  user.password = newPassword;

  //update values
  const editedUser = await user.save();

  //if there is an error
  if (!editedUser) throw new CustomError()


  res.status(200);
  req.result = { status: true, body: user };
  next();
});
/* ***************************************************************** */

/* DELETE USER */
const deleteUser = asyncHandler(async (req, res, next) => {
  //get values from body
  const { password } = req.body;

  //get values from req
  const { name, username } = req.user;

  //control body values
  if (!password) throw new CustomError("Bad request", 400);

  //find user from DB
  const user = await User.findOne({ name, username }).select("+password");


  //if user is not founded
  if (!user) throw new CustomError("This user is not founded", 400);

  //if password is wrong
  if (!checkHashCompare(password, user.password)) throw new CustomError("This password is wrong", 400);

  //update values
  await user.deleteOne();

  res.status(200);
  req.result = { status: true };
  next();
});
/* ***************************************************************** */

/* Update  USER */
const updateUser = asyncHandler(async (req, res, next) => {

  //get values from body
  const changedValues = { ...req.body };

  // Resim dosyası yolu
  const profileImagePath = req.file ? req.file.filename : null;

  if (profileImagePath) changedValues.profile_image = profileImagePath;


  //give values to class
  const updateClass = new Update(changedValues);

  //if body is empty
  if (!updateClass.validateInputs()) {
    req.result = { status: true, message: "You do not make any change." };
    return next();
  }

  //getting values for update
  const valuesForUpdate = updateClass.getForUpdate();

  //get user values from req
  const unchangedValues = { ...req.user };

  //Update user
  const userUpdate = await User.findOneAndUpdate(unchangedValues, valuesForUpdate, { new: 1 }).populate({
    path: 'saved',
    populate: {
      path: 'userid',
      model: 'User'
    }
  });

  //making new refresh token
  const refreshToken = generateToken({
    name: userUpdate.name,
    username: userUpdate.username
  }, 'refresh');


  //making new token
  const token = generateToken({ name: userUpdate.name, username: userUpdate.username });


  res.status(200)
  req.result = { status: true, body: { userUpdate, token, refreshToken } };
  next();

});
/* ***************************************************************** */

/*MOST PROFILES */
const mostprofiles = asyncHandler(async (req, res, next) => {
  const users = await User.find({}, { username: 1, name: 1, profile_image: 1 }).sort({ follower: -1 }).limit(10).exec();
  req.result = { users };
  next();
});
/* ***************************************************************** */


/*SEARCH */
const search = asyncHandler(async (req, res, next) => {
  //getting username
  const { username } = req.body;

  //value control
  if (!username) throw new CustomError('Bad Request', 400);

  //searching 
  const users = await User.find({ $or: [{ username: { $regex: username, $options: "i" } }, { name: { $regex: username, $options: "i" } }] }, { username: 1, name: 1, profile_image: 1 }).sort({ follower: -1 }).exec();

  //returning
  req.result = { users };
  next();
})
/* ***************************************************************** */


/* UPDATE PASSWORD */
const updatePassword = asyncHandler(async (req, res, next) => {

  //getting new and old password
  const { newPassword, oldPassword } = req.body;

  //values control
  if (!newPassword || !oldPassword) throw new CustomError('Bad Request', 400);

  //find user acording to token
  const user = await User.findOne(req.user).select("+password");

  //if user is not founded throwing error 
  if (!user) throw new CustomError("user is not founded", 401);

  //if pasword is wrong
  if (!checkHashCompare(oldPassword, user.password)) throw new CustomError("Old password is wrong", 400);

  //writing new password
  user.password = newPassword;

  //update values
  const editedUser = await user.save();

  //if there is an error
  if (!editedUser) throw new CustomError()


  res.status(200);
  req.result = { status: true, body: { user:editedUser } };
  next();
})
/* ***************************************************************** */


module.exports = {
  signup, profile, visit, forget, resetPassword, resetPasswordUpdate, deleteUser, updateUser, mostprofiles, search, updatePassword
}