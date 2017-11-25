"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createUserModel = Joi.object().keys({
    Email: Joi.string().email()
        .trim()
        .required()
        .example('tunguyene@gmail.com'),
    FullName: Joi.string()
        .required()
        .example('Tu Nguyen'),
    Password: Joi.string().trim().required(),
    Phone: Joi.string()
        .regex(/[0-9]/)
        .required(),
    UserName: Joi.string()
        .required(),
    Gender: Joi.number()
        .valid([0, 1])
        .required(),
    Birthday: Joi.date()
        .required()
        .example('1993-11-12')
        .description('yyyy-mm-dd'),
    GroupId: Joi.number()
        .required()
        .example(2),
    Address: Joi.string()
        .required().max(255),
    City: Joi.number().integer()
        .example(1)
        .description('metatypes: type=city'),
    District: Joi.number()
        .integer()
        .example(1)
        .description('metatypes: type=district'),
    Manager: Joi.string()
        .allow(null)
        .example(null)
        .description("username of manager")
});
exports.createUserModel = createUserModel;
const updateProfileModel = Joi.object().keys({
    Email: Joi.string()
        .email()
        .trim()
        .example('tunguyene@gmail.com')
        .required(),
    FullName: Joi.string().required(),
    Phone: Joi.string()
        .regex(/[0-9]/)
        .required(),
    UserName: Joi.string().required(),
    Birthday: Joi.date()
        .example('1993-11-12')
        .description('yyyy-mm-dd')
        .required(),
    GroupId: Joi.number().valid([2])
        .example(2)
        .required(),
    Address: Joi.string()
        .required()
        .max(255),
    City: Joi.number()
        .integer()
        .description('metatypes: type=city'),
    District: Joi.number().integer()
        .description('metatypes: type=district'),
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