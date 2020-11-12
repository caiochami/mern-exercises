const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const jsonwebtoken = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "password";

const Token = require("../models/token.model");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 5,
      validate: {
        validator: function (v) {
          var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        return next(error);
      }
      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) {
          return next(error);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return callback(error);
    }
    callback(null, isMatch);
  });
};

userSchema.methods.createToken = async function () {
  const newToken = new Token({
    user: this._id,
    token: jsonwebtoken.sign(
      { email: this.email, name: this.name },
      jwtSecret,
      { expiresIn: 60 * 60 }
    ),
  });

  return await newToken.save();
};

userSchema.methods.revokeTokens = async function () {
  let tokens = await this.tokens()

  let ids = tokens.map((token) => {
    return token._id;
  });

  return await Token.deleteMany({
    _id: {
      $in: ids,
    },
  });
};

userSchema.methods.tokens = async function () {
  return await Token.find({
    user: this._id,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
