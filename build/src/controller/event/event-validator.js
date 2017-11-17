"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createModel = Joi.object().keys({
    UserId: Joi.number().required(),
    Address: Joi.string(),
    City: Joi.number().required(),
    District: Joi.number().required(),
    Description: Joi.string()
});
exports.createModel = createModel;
//# sourceMappingURL=event-validator.js.map