const Joi = require('joi');
exports.signUpValidator = Joi.object({
    email: Joi.string()
        .min(6)
        .max(30)
        .required()
        .email(
            {
                tlds: { allow: ['com', 'net'] }
            }
        ),

    password: Joi.string().pattern(new RegExp('^(?=.*[A-Z]).*$')),
        
});

