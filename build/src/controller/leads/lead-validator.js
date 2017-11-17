"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createLeadModel = Joi.object().keys({
    UserId: Joi.number().required(),
    CampId: Joi.number().required(),
    Phone: Joi.string().regex(/[0-9]/).required(),
    Name: Joi.string(),
    Age: Joi.number().required(),
    Gender: Joi.number().required(),
    IncomeMonthly: Joi.number().required(),
    MaritalStatus: Joi.number().required(),
    Address: Joi.string(),
    City: Joi.number().required(),
    District: Joi.number().required(),
    Relationship: Joi.number().required(),
    Source: Joi.number().required(),
    Job: Joi.string(),
    LeadType: Joi.number().required(),
    ProcessStep: Joi.number().required(),
    Description: Joi.string()
});
exports.createLeadModel = createLeadModel;
//# sourceMappingURL=lead-validator.js.map