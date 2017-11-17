"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const campaign_controller_1 = require("./campaign-controller");
const CampaignValidator = require("./campaign-validator");
function default_1(server, configs, database) {
    const campaignController = new campaign_controller_1.default(configs, database);
    server.bind(campaignController);
    server.route({
        method: 'GET',
        path: '/campaigns/{id}',
        config: {
            handler: campaignController.getByCampaignId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get campaign by campaignid.',
            validate: {
                params: {
                    id: Joi.string().required()
                },
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
        method: 'GET',
        path: '/campaigns/userid/{userid}',
        config: {
            handler: campaignController.getByUserId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get all campaigns by userid.',
            validate: {
                params: {
                    userid: Joi.string().required()
                },
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
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Create a campaign.',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
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