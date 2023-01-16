const Joi = require("joi");

exports.validateUserSignUp = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(25).required(),
        email: Joi.string().email().min(2).max(40).required(),
        password: Joi.string().min(2).max(25).required(),
        phone: Joi.string().min(2).max(15).required(),
        income: Joi.number().min(2).max(100000000000).required()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateUserLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().email().min(2).max(40).required(),
        password: Joi.string().min(2).max(25).required()
    })

    return joiSchema.validate(_reqBody);
}