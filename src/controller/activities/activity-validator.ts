import * as Joi from "joi";
const getListModel = Joi.object().keys({
    UserId: Joi.number().required(),
    CampId: Joi.number().required(),
    LeadId: Joi.number().required(),
    // Phone: Joi.string()
    //     .regex(/[0-9]/)
    //     .required(), se lay trong table lead
    // Name: string; khong can thiet, ten se gan them processttep
    Type: Joi.number()
        .valid([1, 2, 3, 4])
        .example(1),
    Location: Joi.string().allow(null),
    StartDate: Joi.date().required()
        .example('2017-11-11')
        .default('2017-11-11'),
    EndDate: Joi.date().required()
        .default('2017-11-12')
        .example('2017-11-12'),
    Description: Joi.string().allow(null),
    FullDate: Joi.boolean()
        .required()
        .description('false=waiting, true=done'),
    Notification: Joi.number()
        .required()
        .description('minutes popup alert before activity happen')
});


const createModel = Joi.object().keys({
    UserId: Joi.number().required(),
    CampId: Joi.number().required(),
    LeadId: Joi.number().required(),
    // Phone: Joi.string()
    //     .regex(/[0-9]/)
    //     .required(), se lay trong table lead
    // Name: string; khong can thiet, ten se gan them processttep
    Type: Joi.number()
        .valid([1, 2, 3, 4])
        .example(1),
    Name: Joi.string()
        .required(), // Title of actiivty
    Location: Joi.string().allow(null),
    StartDate: Joi.date().required()
        .example('2017-11-11')
        .default('2017-11-11'),
    EndDate: Joi.date().required()
        .default('2017-11-12')
        .example('2017-11-12'),
    Description: Joi.string().allow(null),
    FullDate: Joi.boolean()
        .required()
        .description('false=waiting, true=done'),
    Notification: Joi.number()
        .required()
        .description('minutes popup alert before activity happen'),
    IsSupport: Joi
        .boolean()
        .default(false)
        .required()
});


const updateModel = Joi.object().keys({
    // Phone: Joi.string()
    //     .regex(/[0-9]/)
    //     .required(), se lay trong table lead
    // Name: string; khong can thiet, ten se gan them processttep?
    // CampId: Joi.number().required(),
    Name: Joi.string()
        .required(), // Title of actiivty
    Location: Joi.string()
        .description('lorem location')
        .allow(null),
    StartDate: Joi.date()
        .example('2017-11-11')
        .required(),
    EndDate: Joi.date()
        .example('2017-11-12')
        .required(),
    Description: Joi
        .string()
        .example('lorem note')
        .allow(null),
    FullDate: Joi.boolean()
        .required()
        .description('false=waiting, true=done'),
    Status: Joi.number()
        .valid([0, 1])
        .default(0)
        .description('1=done, 0=wating')
        .example(1),
    Notification: Joi
        .number()
        .required()
        .description('minutes popup alert before activity happen'),
    IsSupport: Joi
        .boolean()
        .default(false)
        .required()

});
export { createModel, updateModel };