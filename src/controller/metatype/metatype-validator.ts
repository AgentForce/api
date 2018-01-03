import * as Joi from "joi";
const createModel = Joi.object().keys({
    Type: Joi.string().required().lowercase(),
    Key: Joi.number().required(),
    Value: Joi.string().required(),
    Description: Joi.string().allow('')
});

export { createModel };