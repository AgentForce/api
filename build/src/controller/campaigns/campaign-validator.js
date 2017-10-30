"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.createCampaignModel = Joi.object().keys({
    commission: Joi.number().integer().min(1).required(),
    loan: Joi.number().integer().min(1).required(),
    monthly: Joi.number().integer().min(1).required(),
});
//# sourceMappingURL=campaign-validator.js.map