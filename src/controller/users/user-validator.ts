import * as Joi from "joi";

const createUserModel = Joi.object().keys({
    Email: Joi.string().email()
        .trim()
        .required()
        .example('tunguyene@gmail.com'),
    FullName: Joi.string()
        .required()
        .example('Tu Nguyen'),
    Password: Joi.string().trim().required(),
    Phone: Joi.string().required(),
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

const updateProfileModel = Joi.object().keys({
    // UserId: Joi.number().required(),
    Email: Joi.string().email().trim().required(),
    FullName: Joi.string().required(),
    // Password: Joi.string().trim().required(),
    Phone: Joi.string()
        .required(),
    UserName: Joi.string().required(),
    Birthday: Joi.date().required(),
    GroupId: Joi.number().required(),
    Address: Joi.string().required().max(255),
    City: Joi.number().integer()
        .description('metatypes: type=city'),
    District: Joi.number().integer()
        .description('metatypes: type=district'),
    // ReportTo: Joi.number().integer().default(1)
});

const loginUserModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required()
});

const jwtValidator = Joi.object({ 'authorization': Joi.string().required() }).unknown();
export { createUserModel, updateProfileModel, loginUserModel, jwtValidator };