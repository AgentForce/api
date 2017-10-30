"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const campaign_controller_1 = require("./campaign-controller");
const CampaignValidator = require("./campaign-validator");
const user_validator_1 = require("../users/user-validator");
function default_1(server, configs, database) {
    const campaignController = new campaign_controller_1.default(configs, database);
    server.bind(campaignController);
    server.route({
        method: 'GET',
        path: '/campaigns/{id}',
        config: {
            handler: campaignController.getCampaignById,
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
        path: '/campaigns',
        config: {
            handler: campaignController.createCampaign,
            auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Create a campaign.',
            validate: {
                payload: CampaignValidator.createCampaignModel,
                headers: user_validator_1.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created campaign.'
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map