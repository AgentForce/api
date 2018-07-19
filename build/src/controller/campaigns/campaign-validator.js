"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const moment = require("moment");
const currentDate = moment().format('YYYY-MM-DD');
/**
 * model create camp
 */
const createCampaignFAModel = Joi.object().keys({
    // CampType: Joi.number()
    //     .required()
    //     .example(1)
    //     .description('metatypes: type=camp-camptype'),
    // Name: Joi.string()
    //     .required(),
    // Label: Joi.string()
    //     .valid(['fc', 'fa'])
    //     .required(),
    // Experience: Joi
    //     .string()
    //     .valid(['old', 'new'])
    //     .required(),
    // UserId: Joi.number()
    //     .required(),
    StartDate: Joi.date()
        .required()
        .example(currentDate),
    CaseSize: Joi.number()
        .min(1)
        .required()
        .example(1000000),
    IncomeMonthly: Joi
        .number()
        .min(1)
        .required()
        .example(10000000),
    CommissionRate: Joi.number()
        .min(1)
        .example(10)
        .required()
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