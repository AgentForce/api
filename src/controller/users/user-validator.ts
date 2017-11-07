import * as Joi from "joi";

const createUserModel = Joi.object().keys({
    email: Joi.string().email().trim().required(),
    fullName: Joi.string().required(),
    password: Joi.string().trim().required(),
    phone: Joi.string().required(),
    code: Joi.string().required(),
    groupId: Joi.number().required(),
    address: Joi.string().required().max(255),
    city: Joi.number().integer(),
    district: Joi.number().integer(),
    reportTo: Joi.number().integer()

});

export const updateUserModel = Joi.object().keys({
    email: Joi.string().email().trim(),
    name: Joi.string(),
    password: Joi.string().trim()
});

export const loginUserModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required()
});

export const jwtValidator = Joi.object({ 'authorization': Joi.string().required() }).unknown();
export { createUserModel };