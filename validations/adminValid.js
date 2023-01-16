const Joi = require("joi");

exports.validateAdminLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().email().min(2).max(40).required(),
        password: Joi.string().min(2).max(25).required()
    })

    return joiSchema.validate(_reqBody);
}