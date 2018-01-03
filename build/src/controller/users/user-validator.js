"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createUserModel = Joi.object().keys({
    Email: Joi.string().email()
        .trim()
        .required()
        .example('tunguyene@gmail.com')
        .default('tunguyene@gmail.com'),
    FullName: Joi.string()
        .required()
        .example('Tu Nguyen')
        .default('Tu Nguyen'),
    Password: Joi.string().trim()
        .required()
        .example('123456'),
    Phone: Joi.string()
        .regex(/[0-9]/)
        .required()
        .default('01693248887')
        .example('01693248887'),
    UserName: Joi.string()
        .required(),
    Gender: Joi.number()
        .valid([0, 1])
        .default(0)
        .required(),
    Birthday: Joi.date()
        .required()
        .example('1993-11-12')
        .default('1993-11-12')
        .description('yyyy-mm-dd'),
    GroupId: Joi.number()
        .required()
        .default(2)
        .example(2),
    Address: Joi.string()
        .required().max(255),
    City: Joi.number()
        .integer()
        .example(1)
        .default(1)
        .description('metatypes: type=city'),
    District: Joi.number()
        .integer()
        .default(1)
        .example(1)
        .description('metatypes: type=district'),
    Manager: Joi.string()
        .allow(null)
        .example(null)
        .description("username of manager: null if empty")
});
exports.createUserModel = createUserModel;
const ResourceModel = Joi.object().keys({
    Email: Joi.string().email()
        .trim()
        .required()
        .example('tunguyene@gmail.com')
        .default('tunguyene@gmail.com'),
    FullName: Joi.string()
        .required()
        .example('Tu Nguyen')
        .default('Tu Nguyen'),
    Password: Joi.string().trim()
        .required()
        .example('123456')
});
exports.ResourceModel = ResourceModel;
/**
 * change password model
 */
const changePassModel = Joi.object().keys({
    OldPassword: Joi.string().trim().required(),
    NewPassword: Joi.string().trim().required()
});
exports.changePassModel = changePassModel;
/**
 * validate profile
 */
const updateProfileModel = Joi.object().keys({
    Email: Joi.string()
        .email()
        .trim()
        .example('tunguyene@gmail.com')
        .default('tunguyene@gmail.com')
        .required(),
    FullName: Joi.string().required(),
    Phone: Joi.string()
        .regex(/[0-9]/)
        .required()
        .default('01693248887')
        .example('01693248887'),
    UserName: Joi.string().required(),
    Birthday: Joi.date()
        .example('1993-11-12')
        .default('1993-11-12')
        .description('yyyy-mm-dd')
        .required(),
    GroupId: Joi.number().valid([2])
        .example(2)
        .default(2)
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
    Username: Joi.string().required(),
    Password: Joi.string().trim().required()
});
exports.loginUserModel = loginUserModel;
const loginResourceModel = Joi.object().keys({
    Email: Joi.string().required(),
    Password: Joi.string().trim().required()
});
exports.loginResourceModel = loginResourceModel;
const jwtValidator = Joi.object({ 'authorization': Joi.string().required() }).unknown();
exports.jwtValidator = jwtValidator;
//# sourceMappingURL=user-validator.js.map