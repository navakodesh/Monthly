const Joi = require("joi");

exports.validateExpenses = (_reqBody) => {
    let joiSchema = Joi.object({
        category: Joi.string().min(2).max(25).allow(null, ""),
        name: Joi.string().min(2).max(25).required(),
        amount: Joi.number().min(1).max(1000000).required(),
        monthly: Joi.string().required()

    })
    return joiSchema.validate(_reqBody);
}

