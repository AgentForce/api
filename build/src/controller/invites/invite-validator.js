"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createModel = Joi.object().keys({
    UserId: Joi.number(),
    LeadId: Joi.number().allow(null),
    ProcessStep: Joi.number(),
    UserIdInvite: Joi.number().allow(null),
    Description: Joi.string(),
});
exports.createModel = createModel;
//# sourceMappingURL=invite-validator.js.map