import * as Joi from "joi";

const createUserModel = Joi.object().keys({
    Email: Joi.string().email().trim().required(),
    FullName: Joi.string().required(),
    Password: Joi.string().trim().required(),
    Phone: Joi.string().required(),
    UserName: Joi.string().required(),
    Birthday: Joi.date().required(),
    GroupId: Joi.number().required(),
    Address: Joi.string().required().max(255),
    City: Joi.number().integer().description('metatypes: type=city'),
    District: Joi.number().integer().description('metatypes: type=district'),
    ReportTo: Joi.number().integer()

});

const updateProfileModel = Joi.object().keys({
    email: Joi.string().email().trim(),
    name: Joi.string(),
    password: Joi.string().trim()
});

const loginUserModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required()
});

const jwtValidator = Joi.object({ 'authorization': Joi.string().required() }).unknown();
export { createUserModel, updateProfileModel, loginUserModel, jwtValidator };