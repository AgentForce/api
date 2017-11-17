"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const lead_controller_1 = require("./lead-controller");
const CampaignValidator = require("./lead-validator");
const user_validator_1 = require("../users/user-validator");
function default_1(server, configs, database) {
    const leadController = new lead_controller_1.default(configs, database);
    server.bind(leadController);
    server.route({
        method: 'GET',
        path: '/leads/{id}',
        config: {
            handler: leadController.getCampaignById,
            auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get campaigns by id.',
            validate: {
                params: {
                    id: Joi.string().required()
                },
                headers: user_validator_1.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Campaign founded.'
                        },
                        '404': {
                            'description': 'Campaign does not exists.'
                        }
                    }
                }
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/leads',
        config: {
            handler: leadController.create,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Create a leads.',
            validate: {
                payload: CampaignValidator.createLeadModel,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created lead.'
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map