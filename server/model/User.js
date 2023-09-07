const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "You must type name"],
        trim: true,
        minlength: 3,
        maxlength: 28,
        match:/^[a-zA-Z\s]{3,28}$/
    },
    username: {
        type: String,
        required: [true, "You must type username"],
        trim: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 28
    },
    email: {
        type: String,
        required: [true, "You must type email"],
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
        type: String,
        required: [true, "You must type password"],
        select: false
    },
    hidden: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    stopped: {
        type: Boolean,
        default: false
    },
    profile_image: {
        type: String,
        default: 'default.png'
    },
    bio:{
        type:String
    },
    birth:{
        type:Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    saved:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    follow:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    follower:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

UserSchema.methods.getResetPasswordTokenFromUser = function () {
    const { RESET_PASSWORD_EXPIRE } = process.env;
    const randomHexString = crypto.randomBytes(15).toString('hex');

    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex")

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
}

UserSchema.pre('save', function (next) {
    if (!this.isModified("pssword")) next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})

module.exports = mongoose.model("User", UserSchema);