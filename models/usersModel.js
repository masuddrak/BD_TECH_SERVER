const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [6, "Email is too short"],
      maxlength: [32, "Email is too long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
      minlength: [6, "Password is too short"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeVerified: {
      type: Number,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeVerification: {
      type: Number,
      select: false,
    },
  },
  { timestamps: true } // Fixed typo
);

module.exports = mongoose.model("User", userSchema);
