import * as Joi from "joi";
const createModel = Joi.object().keys({
    UserId: Joi.number().required(),
    CampId: Joi.number().required(),
    LeadId: Joi.number().required(),
    // Phone: Joi.string()
    //     .regex(/[0-9]/)
    //     .required(), se lay trong table lead
    // Name: string; khong can thiet, ten se gan them processttep
    ProcessStep: Joi.number()
        .required(),
    Location: Joi.string().allow(null),
    StartDate: Joi.date().required()
        .example('2017-11-11'),
    EndDate: Joi.date().required()
        .example('2017-11-12'),
    Description: Joi.string().allow(null),
    FullDate: Joi.boolean()
        .required()
        .description('0=waiting, 1=done'),
    Notification: Joi.number()
        .required()
        .description('minutes popup alert before activity happen')
});

export { createModel };