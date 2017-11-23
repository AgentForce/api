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
const updateProfileModel = Joi.object().keys({
    // UserId: Joi.number().required(),
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
exports.updateProfileModel = updateProfileModel;
const loginUserModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required()
});
exports.loginUserModel = loginUserModel;
const jwtValidator = Joi.object({ 'authorization': Joi.string().required() }).unknown();
exports.jwtValidator = jwtValidator;
//# sourceMappingURL=user-validator.js.map