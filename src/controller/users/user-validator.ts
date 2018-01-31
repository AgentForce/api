import * as Joi from "joi";

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


/**
 * change password model
 */
const changePassModel = Joi.object().keys({
    OldPassword: Joi.string().trim().required(),
    NewPassword: Joi.string().trim().required()
});

/**
 * change password model
 */
const verifyOTPModel = Joi.object().keys({
    Code: Joi.string()
        .trim()
        .required(),
    UserName: Joi.string()
        .required(),
    Phone: Joi
        .string()
        .required()
});

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
    // ReportTo: Joi.number().integer().default(1)
});


const loginUserModel = Joi.object().keys({
    UserName: Joi
        .string()
        .required(),
    Password: Joi
        .string()
        .trim()
        .required(),
});

const headerModel = Joi.object().keys({
    clientid: Joi
        .string()
        .required(),
    versionos: Joi
        .string()
        .default('1.3 fix')
        .required(),
    versionapp: Joi.string()
        .default('2.0')
        .required(),
    devicename: Joi.string().default('samsung').required(),
    imei: Joi.string().required()

}).unknown();

const headersChecksumModel = Joi.object().keys({
    clientid: Joi
        .string()
        .default('123456')
        .required(),
    versionos: Joi
        .string()
        .default('1.3 fix')
        .required(),
    versionapp: Joi.string()
        .default('2.0')
        .required(),
    devicename: Joi.string().default('samsung').required(),
    imei: Joi.string().required()
        .default('123456'),
    checksum: Joi.string()
        .default('22342345')
        .required()

}).unknown();


const loginResourceModel = Joi.object().keys({
    UserName: Joi.string().required(),
    Password: Joi
        .string()
        .trim()
        .required()
});
const jwtValidator = Joi.object({ 'authorization': Joi.string().required() }).unknown();
export {
    createUserModel,
    updateProfileModel,
    loginUserModel,
    jwtValidator,
    changePassModel,
    ResourceModel,
    loginResourceModel,
    verifyOTPModel,
    headerModel,
    headersChecksumModel
};