import * as Joi from "joi";
const createCampaignModel = Joi.object().keys({
    campType: Joi.string().required(),
    name: Joi.string().required(),
    userId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    // numberofleads: number;
    targetCall: Joi.number().required(),
    targetMetting: Joi.number().required(),
    targetPresentation: Joi.number().required(),
    targetContract: Joi.number().required(),
    description: Joi.string(),
    commission_rate__c: Joi.number(),
    policy_amount__c: Joi.number(),
    income_Monthly__c: Joi.number()
});

export { createCampaignModel };