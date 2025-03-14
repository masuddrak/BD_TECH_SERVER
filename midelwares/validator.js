const Joi = require("joi");
const {createHmac}= require("crypto");
exports.signUpValidator = Joi.object({
  email: Joi.string()
    .min(6)
    .max(30)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string().pattern(new RegExp("^(?=.*[A-Z]).*$")),
});
exports.signInValidator = Joi.object({
  email: Joi.string()
    .min(6)
    .max(30)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string().pattern(new RegExp("^(?=.*[A-Z]).*$")),
});
// node hmacValidator
exports.hmacValidator = (value, key) => {
  const result=createHmac('sha256',key).update(value).digest('hex');
  return result;
}
// code validate schema
exports.acceptedCodeValidator=Joi.object({
  email: Joi.string()
    .min(6)
    .max(30)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  providedCode: Joi.number().required(),
});

exports.changePasswordValidator = Joi.object({
  newPassword: Joi.string().pattern(new RegExp("^(?=.*[A-Z]).*$")),
  oldPassword: Joi.string().pattern(new RegExp("^(?=.*[A-Z]).*$")),

})