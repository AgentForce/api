import * as Joi from "joi";
const createModel = Joi.object().keys({
    UserId: Joi.number().required(),
    Address: Joi.string(),
    City: Joi.number().required(),
    District: Joi.number().required(),
    Description: Joi.string()
});

export { createModel };