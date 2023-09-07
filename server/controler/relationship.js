const asyncHandler = require('express-async-handler');
const CustomError = require('../helper/error/CustomError');
const User = require('../model/User');
const Note = require('../model/Note');

const like = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) throw new CustomError("Bad Request", 400);

  const user = await User.findOne(req.user);

  if (!user) throw new CustomError("Authorization error", 400);

  const note = await Note.findOneAndUpdate({ _id: id }, { $addToSet: { liked: user._id } }, { new: 1 });

  if (!note) throw new CustomError("Internal Server Error", 500);

  req.result = { status: true, note };
  next();
});

const unlike = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) throw new CustomError("Bad Request", 400);

  const user = await User.findOne(req.user);

  if (!user) throw new CustomError("Authorization error", 400);

  const note = await Note.findOneAndUpdate({ _id: id }, { $pull: { liked: user._id } }, { new: 1 });

  if (!note) throw new CustomError("Internal Server Error", 500);

  req.result = { status: true, note };
  next();
});

const save = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) throw new CustomError("Bad Request", 400);

  const note = await Note.findOne({ _id: id });

  if (!note) throw new CustomError("Note is not founded", 400);

  const user = await User.findOneAndUpdate(req.user, { $addToSet: { saved: note._id } }, { new: 1 }).populate({
    path: 'saved',
    populate: {
      path: 'userid',
      model: 'User'
    }
  });

  if (!user) throw new CustomError("Internal Server Error", 500);

  req.result = { status: true, user };
  next();
});

const unsave = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) throw new CustomError("Bad Request", 400);

  const note = await Note.findOne({ _id: id });

  if (!note) throw new CustomError("Note is not founded", 400);

  const user = await User.findOneAndUpdate(req.user, { $pull: { saved: note._id } }, { new: 1 }).populate({
    path: 'saved',
    populate: {
      path: 'userid',
      model: 'User'
    }
  });

  if (!user) throw new CustomError("Internal Server Error", 500);

  req.result = { status: true, user };
  next();
});

const newComment = asyncHandler(async (req, res, next) => {
  const { text, id } = req.body;

  if (!id || !text) throw new CustomError("Bad Request", 400);

  const note = await Note.findOne({ _id: id });

  if (!note) throw new CustomError("Note is not founded", 400);

  const user = await User.findOne(req.user);

  if (!user) throw new CustomError("Authorization Error", 401);

  try {
    const newComment = {
      text,
      userid: user._id
    };
    const editedNote = await Note.findOneAndUpdate({ _id: id }, { $push: { comment: { $each: [newComment], $sort: { createdAt: -1 } } } }, { new: 1 }).populate('userid comment comment.userid');


    req.result = { status: true, body: { editedNote } };
    next();
  } catch {
    throw new CustomError("Internal Server Error", 500);
  }
});


const updateComment = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) throw new CustomError("Bad Request", 400);

  const user = await User.findOne(req.user);

  if (!user) throw new CustomError("Authorization Error", 401);

  const findNote = await Note.findOne({ 'comment._id': id, 'comment.userid': user._id });

  if (!findNote) throw new CustomError("Comment is not founded", 400);

  try {
    const editedNote = await Note.findOneAndUpdate({ 'comment._id': id, 'comment.userid': user._id }, { $pull: { comment: { _id: id } } }, { new: 1 }).populate('userid comment comment.userid');

    req.result = { status: true, body: { editedNote } };
    next();
  } catch {
    throw new CustomError("Internal Server Error", 500);
  }
});

const getCommentNote = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  if (!id) throw new CustomError("Bad Request", 400);

  const user = await User.findOne(req.user);

  if (!user) throw new CustomError("Authorization Error", 401);

  const note = await Note.findOne({ _id: id })
  if (!note) throw new CustomError("Bad Request", 400);

  let comments = [];

  if (note.accessibility == 'private') {
    if (note.userid.equals(user._id)) {
      comments = note.comment;
    }
    else {
      comments = note.comment.filter(e => {
        if (user._id.equals(e.userid)) return e;
      });
    }

  } else {
    comments = note.comment;
  }


  req.result = { status: true, body: { comments } };
  next();
})


const getCommentProfile = asyncHandler(async (req, res, next) => {

  const user = await User.findOne(req.user);

  if (!user) throw new CustomError("Authorization Error", 401);

  const note = await Note.aggregate([
    { $unwind: '$comment' },
    { $match: { 'comment.userid': user._id } }
  ]);
  if (!note) throw new CustomError("Bad Request", 400);


  req.result = { status: true, body: { note } };
  next();
})

const follow = asyncHandler(async (req, res, next) => {

  const { username } = req.body;

  if (!username) throw new CustomError("Bad Request", 400);

  const follower = await User.findOne(req.user);

  if (!follower) throw new CustomError("Authorization Error", 401);

  if (follower.username == username) throw new CustomError("Can not follow yourself", 400);

  const followed = await User.findOne({ username });

  try {
    const editedFollower = await User.findByIdAndUpdate(follower._id, { $addToSet: { follow: followed._id } }, { new: 1 });
    const editedFollowed = await User.findByIdAndUpdate(followed._id, { $addToSet: { follower: follower._id } }, { new: 1 });


    req.result = { status: true, body: { editedFollower, editedFollowed} };
    next();
  } catch {
    req.result = { status: false };
    next();
  }

})


const unfollow = asyncHandler(async (req, res, next) => {

  const { username } = req.body;

  if (!username) throw new CustomError("Bad Request", 400);

  const follower = await User.findOne(req.user);

  if (!follower) throw new CustomError("Authorization Error", 401);

  if (follower.username == username) throw new CustomError("Can not follow yourself", 400);

  const followed = await User.findOne({ username });

  try {
    const editedFollower = await User.findByIdAndUpdate(follower._id, { $pull: { follow: followed._id } }, { new: 1 });
    const editedFollowed = await User.findByIdAndUpdate(followed._id, { $pull: { follower: follower._id } }, { new: 1 });


    req.result = { status: true, body: { editedFollower, editedFollowed } };
    next();
  } catch {
    req.result = { status: false };
    next();
  }

})

const deleteComment = asyncHandler(async (req, res, next) => {
  const { id, noteId } = req.body;

  if (!id || !noteId) throw new CustomError('Bad Request', 400);

  const note = await Note.findByIdAndUpdate(noteId, { $pull: { comment: { _id: id } } }, { new: 1 }).populate('userid comment comment.userid');

  if (!note) {
    throw new CustomError('Belirtilen ID ile note bulunamadı.', 404);
  }

  req.result = { status: true, note };

  next();  
})



module.exports = {
  like, unlike, save, unsave, newComment, updateComment, getCommentNote, getCommentProfile, follow, unfollow, deleteComment
}