import * as Joi from "joi";
import * as Sequelize from 'sequelize';
const createCampaignModel = Joi.object().keys({
    commission: Joi.number().integer().min(1).required(),
    loan: Joi.number().integer().min(1).required(),
    monthly: Joi.number().integer().min(1).required(),
});

export { createCampaignModel };