import * as Joi from "joi";
const createLeadModel = Joi.object().keys({
    UserId: Joi.number().required().description('user id'),
    CampId: Joi.number().required().description('Campaign id'),
    Phone: Joi.string().regex(/[0-9]/).required().description('number phone of customer'),
    Name: Joi.string().description('Full name'),
    Age: Joi.number().required().valid([1, 2, 3, 4]).description('Get info from api /types, key=rangeage'),
    Gender: Joi.number().required().valid([0, 1]).description('Gender of customer. 0 = male, 1 = female'),
    IncomeMonthly: Joi.number().valid([1, 2, 3, 4]).required().description('Get info from api /types, key=IncomeMonthly'),
    MaritalStatus: Joi.number().required(),
    Address: Joi.string(),
    City: Joi.number().required().description('Get info from api /types, key=city'),
    District: Joi.number().required().description('Get info from api /types, key=district'),
    Relationship: Joi.number().required().description('Get info from api /types, key=relationship'),
    Source: Joi.number().required(),
    Job: Joi.string(),
    LeadType: Joi.number().required().description('Get info from api /types, key=leadtype'),
    Description: Joi.string()
});

export { createLeadModel };