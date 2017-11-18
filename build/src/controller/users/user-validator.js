"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
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
exports.createUserModel = createUserModel;
const updateUserModel = Joi.object().keys({
    email: Joi.string().email().trim(),
    name: Joi.string(),
    password: Joi.string().trim()
});
exports.updateUserModel = updateUserModel;
const loginUserModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required()
});
exports.loginUserModel = loginUserModel;
const jwtValidator = Joi.object({ 'authorization': Joi.string().required() }).unknown();
exports.jwtValidator = jwtValidator;
//# sourceMappingURL=user-validator.js.map