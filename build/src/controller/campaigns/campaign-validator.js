"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createCampaignFAModel = Joi.object().keys({
    CampType: Joi.number().required()
        .default(1)
        .description('metatypes: type=camp-camptype'),
    Name: Joi.string().required(),
    Label: Joi.string()
        .valid(['fc', 'fa']).required(),
    Experience: Joi.string()
        .valid(['old', 'new']).required(),
    UserId: Joi.number().required(),
    StartDate: Joi.date().required()
        .default('2017-11-12')
        .example('2017-11-12'),
    CaseSize: Joi.number().min(1).required(),
    IncomeMonthly: Joi.number().min(1).required(),
    CommissionRate: Joi.number().min(1).required()
});
exports.createCampaignFAModel = createCampaignFAModel;
/**
 * update model validate
 */
const updateModel = Joi.object().keys({
    CurrentCallSale: Joi.number()
        .required(),
    CurrentMetting: Joi.number()
        .required(),
    CurrentContract: Joi.number()
        .required(),
    CurrentPresentation: Joi.number()
        .required(),
});
exports.updateModel = updateModel;
//# sourceMappingURL=campaign-validator.js.map