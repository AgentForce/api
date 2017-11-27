import * as Joi from "joi";
const createCampaignFAModel = Joi.object().keys({
    CampType: Joi.number().required().description('metatypes: type=camp-camptype'),
    Name: Joi.string().required(),
    Label: Joi.string().valid(['fc', 'fa']).required(),
    Experience: Joi.string().valid(['old', 'new']).required(),
    UserId: Joi.number().required(),
    StartDate: Joi.date().required(),
    CaseSize: Joi.number().min(1).required(),
    IncomeMonthly: Joi.number().required(),
    CommissionRate: Joi.number().required()
});

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
export { createCampaignFAModel, updateModel };