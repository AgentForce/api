import * as Joi from "joi";
const createModel = Joi.object().keys({
    UserId: Joi.number(),
    LeadId: Joi.number().allow(null),
    ProcessStep: Joi.number(),
    UserIdInvite: Joi.number().allow(null),
    Description: Joi.string(),
});

export { createModel };