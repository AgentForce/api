"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createLeadModel = Joi.object({
    CampId: Joi.number()
        .required()
        .description('Campaign id'),
    Phone: Joi.string()
        .regex(/^[0-9]*$/)
        .required()
        .example('01693248887')
        .description('number phone of customer'),
    Name: Joi.string()
        .description('Full name'),
    Age: Joi.number().required()
        .valid([1, 2, 3, 4])
        .example(1)
        .description('Get info from api /types, key=age'),
    Gender: Joi.number().required()
        .valid([0, 1])
        .description('Gender of customer. 0 = male, 1 = female'),
    IncomeMonthly: Joi.number()
        .valid([1, 2, 3, 4])
        .required()
        .description('Get info from api /types, key=IncomeMonthly')
        .example(1),
    Type: Joi.number()
        .required()
        .valid([1, 2, 3, 4])
        .example(1)
        .description('4 type of activity'),
    MaritalStatus: Joi.number()
        .valid([1, 2, 3, 4])
        .required()
        .example(1)
        .description('Get info from api /types, key=MaritalStatus'),
    Relationship: Joi.number()
        .required()
        .description('Get info from api /types, key=Relationship'),
    Source: Joi.number()
        .required()
        .description('Get info from api /types, key=Source'),
    // Job: Joi.string(),
    LeadType: Joi.number()
        .required()
        .description('Get info from api /types, key=LeadType'),
    Description: Joi
        .string()
        .max(500)
});
exports.createLeadModel = createLeadModel;
const updateModel = Joi.object().keys({
    Name: Joi.string()
        .default('Phuong Thao')
        .description('Full name'),
    Age: Joi.number().required()
        .valid([1, 2, 3, 4])
        .description('Get info from api /types, key=age'),
    Gender: Joi.number().required()
        .valid([0, 1])
        .description('Gender of customer. 0 = male, 1 = female'),
    IncomeMonthly: Joi.number()
        .valid([1, 2, 3, 4])
        .required()
        .description('Get info from api /types, key=IncomeMonthly')
        .default(1),
    MaritalStatus: Joi.number()
        .valid([1, 2, 3, 4])
        .required()
        .description('Get info from api /types, key=MaritalStatus'),
    // Type: Joi.number()
    //     .required()
    //     .valid([1, 2, 3, 4])
    //     .description('4 type of activity'),
    Relationship: Joi.number()
        .required()
        .description('Get info from api /types, key=Relationship'),
    Source: Joi.number()
        .required()
        .description('Get info from api /types, key=Source'),
    // Job: Joi.string(),
    // LeadType: Joi.number()
    //     .required()
    //     .description('Get info from api /types, key=LeadType'),
    Description: Joi.string().max(500)
});
exports.updateModel = updateModel;
const updateStatusModel = Joi.object().keys({
    ProcessStep: Joi.number().required(),
    StatusProcessStep: Joi.number().required()
});
exports.updateStatusModel = updateStatusModel;
//# sourceMappingURL=lead-validator.js.map