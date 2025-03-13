const transport = require("../midelwares/sendMail");
const { signUpValidator, signInValidator, hmacValidator, acceptedCodeValidator } = require("../midelwares/validator");
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
    const token = jwt.sign(
      {
        email: existUser.email,
        id: existUser._id,
        verified: existUser.verified,
      },
      process.env.jwtSecret,
      { expiresIn: "8h" }
    );
    res
      .cookie(
        "Authorization",
        "Bearer" + token,
        { expires: new Date(Date.now() + 8 * 3600000) },
        { httpOnly: process.env.NODE_ENV === "production" },
        { secure: process.env.NODE_ENV === "production" }
      )
      .json({
        success: true,
        message: "login successfully",
        token: token,
      });
  } catch (error) {
    console.log("signin error", error);
  }
};
// sign out
exports.signout = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ success: true, message: "signout successfully" });
};
// verification code
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const code = Math.floor(Math.random() * 900000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_SENDING_EMAIL_ADDRESS,
      to: existUser.email,
      subject: "verification code",
      html: `<h1>your verification code is ${code}</h1>`,
    });
    if (info.accepted[0] === existUser.email) {
      const hmacCode = hmacValidator(code, process.env.hmacKey);
      existUser.verificationCode = hmacCode;
      existUser.verificationCodeVerified = new Date();
      
      await existUser.save();
      return res.status(200).json({success:true,message:"verification code sent"});
    }
    res.status(400).json({success:false,message:"email not sent"});
  } catch (error) {
    console.log("verification code error", error);
    res.status(500).json({ success: false, message: "server error" });
    
  }
}
exports.verifyVerificationCode = async (req, res) => {
  const { email, providedCode } = req.body
  try {
    
    const { error, value } = acceptedCodeValidator.validate({ email, providedCode })
    if (error) {
     return res.status(201).json({success:false,message:error.details[0].message})
    }
    const codeValue=providedCode.toString()
    const existUser = await User.findOne({ email }).select("+verificationCode +verificationCodeVerified")
    if (!existUser) {
     return res.status(404).json({success:false,message:"user not found"})
    }
    if (existUser.verified) {
      return res.status(400).json({success:false,message:"You are already verified"})
    }
    if (!existUser.verificationCode || !existUser.verificationCodeVerified) {
      return res.status(400).json({success:false,message:"somethig is wrong!!"})
    }
    if (new Date() - existUser.verificationCodeVerified > 5 * 60 * 1000) {
      return res.status(404).json({success:false,message:"your code i expaird!!"})
    }
    const compaireCodeValue = hmacValidator(codeValue, process.env.hmacKey)
    console.log(compaireCodeValue,existUser.verificationCode)
    if (compaireCodeValue === existUser.verificationCode) {
      existUser.verified = true
      existUser.verificationCodeVerified=undefined
      existUser.verificationCode = undefined
      await existUser.save()
      return res.status(200).json({success:true,message:"verified you successfully"})
    }
    return res.status(400).json({success:false,message:"unexpected author"})

  } catch (error) {
    console.log(error)
  }
}