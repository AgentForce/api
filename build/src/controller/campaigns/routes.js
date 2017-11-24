"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const campaign_controller_1 = require("./campaign-controller");
const CampaignValidator = require("./campaign-validator");
const HTTP_STATUS = require("http-status");
function default_1(server, configs, database) {
    const campaignController = new campaign_controller_1.default(configs, database);
    server.bind(campaignController);
    /**
         * lấy 1 campaign theo campaignid
         */
    server.route({
        method: 'GET',
        path: '/campaigns/{id}/customers/{type}',
        config: {
            handler: campaignController.leadsOfCamp,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get Customer in a campaigns by id.',
            validate: {
                params: {
                    id: Joi.string().required().description('Campaignid'),
                    type: Joi.number().required().valid([1, 2, 3, 4]).description('4 processtep in lead')
                },
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            status: HTTP_STATUS.OK,
                            'description': 'Campaign .'
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
        path: '/campaigns/{id}',
        config: {
            handler: campaignController.getByCampaignId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get campaign by campaignid.',
            validate: {
                params: {
                    id: Joi.string().required().description('campaignid')
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
    // server.route({
    //     method: 'PUT',
    //     path: '/campaigns/{id}',
    //     config: {
    //         handler: campaignController.getByCampaignId,
    //         // auth: "jwt",
    //         tags: ['api', 'campaigns'],
    //         description: 'Update a campaign',
    //         validate: {
    //             params: {
    //                 id: Joi.string().required()
    //             },
    //             // headers: jwtValidator
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: {
    //                     200: {
    //                         'description': 'Campaign founded.'
    //                     },
    //                     404: {
    //                         'description': 'Campaign does not exists.'
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });
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
                // headers: jwtValidator
                failAction: (request, reply, source, error) => {
                    return reply({
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: 'mnl_1', msg: 'payload dont valid',
                            details: error
                        }
                    });
                }
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