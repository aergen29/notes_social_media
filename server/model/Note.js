const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: [true, "Please type something"]
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



const NoteSchema = new Schema({
  text: {
    type: String,
    required: [true, "Please type something"]
  },
  html: {
    type: String,
    required: [true, "Please type something"]
  },
  images: {
    type: Array
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  accessibility: {
    type: String,
    default: "private"
  },
  link: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastEditAt: {
    type: Date
  },
  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comment: [CommentSchema],
});

NoteSchema.pre('save', async function (next) {
  if (!this.isModified("link")) next();
  if (!this.isNew) next();
  let existingLink;
  do {
    let firstChars = this.text.split(" ").join("").slice(0, 3);
    let rand = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
    this.link = `${firstChars}${rand}`;
    existingLink = await this.constructor.findOne({ link: this.link });
  } while (existingLink);
  next();
})

NoteSchema.pre('save', async function (next) {
  this.lastEditAt = Date.now;
  next();
})


module.exports = mongoose.model("Note", NoteSchema)