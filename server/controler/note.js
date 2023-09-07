const asyncHandler = require('express-async-handler');
const CustomError = require('../helper/error/CustomError');
const Note = require('../model/Note');
const User = require('../model/User');
const { NewNote, EditNote } = require('../helper/valueControl/note');
const { tokenOpen } = require('../helper/token/token');

/*NEWNOTE*/
const newNote = asyncHandler(async (req, res, next) => {
  //get valuesfrom req.body
  const { html, text, images, accessibility } = req.body;


  //give values to class
  const newNoteClass = new NewNote(text, html, images, accessibility);

  //find the user
  const user = await User.findOne({ username: req.user.username, stopped: false });

  //bring values from save
  let values = newNoteClass.getForSave(user._id);

  //save values
  const newNote = await Note.create(values);

  //if save became unsuccessful
  if (!newNote) throw new CustomError("Server error", 500);

  res.status(200);
  req.result = { status: true, body: { newNote } };
  next();
})
/* ********************************************************************** */

/*EDITNOTE*/
const editNote = asyncHandler(async (req, res, next) => {
  //get valuesfrom req.body
  const { text, images, accessibility, link, html } = req.body;

  //give values to class
  const editNoteClass = new EditNote(text, images, accessibility, link ,html );

  //values control
  if (!editNoteClass.validateInput()) throw new CustomError("Bad request", 400);

  //find the user
  const user = await User.findOne({ username: req.user.username, stopped: false });

  //bring values from save
  let values = editNoteClass.getForUpdate(user._id);

  //update values
  const editedNote = await Note.findOneAndUpdate({ userid: values.userid, link: values.link }, values, { new: true }).populate('userid comment comment.userid');;

  //if update became unsuccessful
  if (!editedNote) throw new CustomError("Note is not founded", 400)

  res.status(200);
  req.result = { status: true ,note:editedNote};
  next();
})
/* ********************************************************************** */


/* GET NOTE */
const getNote = asyncHandler(async (req, res, next) => {
  const { link } = req.params;


  const note = await Note.findOne({ link }).populate('userid comment comment.userid');

  note.comment.sort((a, b) => b.createdAt - a.createdAt);

  if (note.accessibility == "private") {
    //token control
    const tokenControl = await tokenOpen(req);

    //if token control has any error
    if (tokenControl != true) throw new CustomError(tokenControl[0], tokenControl[1]);

    //find token user
    const user = await User.findOne(req.user);

    //if user did not save the note
    if (!user._id.equals(note.userid._id)) throw new CustomError("You are not authorized to access this page", 401);


    res.status(200);
    req.result = { status: true, body: { note } };
    return next();
  }


  res.status(200);
  req.result = { status: true, body: { note } };
  next();
})
/* ********************************************************************** */


/* GET MANY PROFILE */
const getManyProfile = asyncHandler(async (req, res, next) => {

  //token control
  const tokenControl = await tokenOpen(req);


  //get values from body
  const { username } = req.body;

  //if values is not exist
  if (!username) throw new CustomError("Bad Request", 400);

  //find user
  const profile = await User.findOne({ username });

  //if finding user has an error
  if (!profile) throw new CustomError("User is not founded", 400);

  //finding notes
  const notes = await Note.find({ userid: profile._id }).populate('userid').sort({ createdAt: -1 });

  if (tokenControl != true || req.user.username != profile.username) {
    const suitnotes = notes.filter(e => e.accessibility != 'private');
    res.status(200)
    req.result = { status: true, body: { notes: suitnotes } };
    return next();
  }


  res.status(200);
  req.result = { ok: 'ok', body: { notes } };
  next();
})

/* ********************************************************************** */


/* GET MANY MAIN */
const getManyMain = asyncHandler(async (req, res, next) => {

  //find logined user
  const user = await User.findOne({ username: req.user.username });
  //find follows by the user
  const follows = user.follow;

  let allNotes = [];
  for (let follow of follows) {
    //find user
    let profile = await User.findOne({ _id: follow });
    //finding notes
    let userNotes = await Note.find({ userid: profile._id, accessibility: "public" })
      .populate('userid comment comment.userid').sort({ createdAt: -1 });
    allNotes = [...allNotes, ...userNotes];
  }

  res.status(200);
  req.result = { status: true, body: { allNotes } };
  next();
})

/* ********************************************************************** */


/* DELETE NOTE */
const deleteNote = asyncHandler(async (req, res, next) => {
  const { link } = req.params;
  if (!link) throw new CustomError("Bad request", 400);
  const user = await User.findOne({ username: req.user.username });
  if (!user) throw new CustomError("Authorization Error", 401);
  const deletedNote = await Note.findOneAndRemove({ link, userid: user._id });
  if (!deletedNote) throw new CustomError("Note is not founded", 500);
  res.status(200);
  req.result = { status: true };
  next();
});
/* ********************************************************************** */



module.exports = {
  newNote, editNote, getNote, getManyProfile, deleteNote, getManyMain
}