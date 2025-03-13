const { signUpValidator } = require("../midelwares/validator");
const User = require("../models/usersModel");
const { dohash } = require("../utills/hassing");

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
