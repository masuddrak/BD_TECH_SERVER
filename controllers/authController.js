const { signUpValidator, signInValidator } = require("../midelwares/validator");
const User = require("../models/usersModel");
const { dohash, compareHashPassword } = require("../utills/hassing");
const jwt = require("jsonwebtoken");
exports.signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signUpValidator.validate({ email, password });

    if (error) {
      return res
        .status(201)
        .json({ success: false, message: error.details[0].message });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(201)
        .json({ success: false, message: "user already exist" });
    }

    const hashPassword = await dohash(password, 10);
    const newUser = new User({
      email: email,
      password: hashPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(200).json({
      success: true,
      message: "create user successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
    console.log(error);
  }
};
// sign in
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signInValidator.validate({ email, password });
    if (error) {
      return res
        .status(201)
        .json({ success: false, message: error.details[0].message });
    }

    const existUser = await User.findOne({ email }).select("+password");
    if (!existUser) {
      return res
        .status(201)
        .json({ success: false, message: "user not found" });
    }
    const compairePassword = await compareHashPassword(
      password,
      existUser.password
    );
    if (!compairePassword) {
      return res
        .status(201)
        .json({ success: false, message: "password not correct" });
    }
    const token = jwt.sign({
      email: existUser.email,
      id: existUser._id,
      verified: existUser.verified,
    },
      process.env.jwtSecret,
      {expiresIn : "8h"},
    );
    res.cookie("Authorization", "Bearer" + token, { expires: new Date(Date.now() + 8 * 3600000) }, { httpOnly: process.env.NODE_ENV === "production" }, { secure: process.env.NODE_ENV === "production" }).json({
      success: true,
      message: "login successfully",
      token: token,
    });
  } catch (error) {
    console.log("signin error", error);
  }
};
