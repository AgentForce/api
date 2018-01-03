"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const createModel = Joi.object().keys({
    Type: Joi.string().required().lowercase(),
    Key: Joi.number().required(),
    Value: Joi.string().required(),
    Description: Joi.string().allow('')
});
exports.createModel = createModel;
//# sourceMappingURL=metatype-validator.js.map