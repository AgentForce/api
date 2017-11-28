"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const campaign_controller_1 = require("./campaign-controller");
const CampaignValidator = require("./campaign-validator");
const user_validator_1 = require("../users/user-validator");
const HTTP_STATUS = require("http-status");
const code_errors_1 = require("../../helpers/code-errors");
const index_1 = require("../../mongo/index");
const index_2 = require("../../helpers/index");
function default_1(server, configs, database) {
    const campaignController = new campaign_controller_1.default(configs, database);
    server.bind(campaignController);
    /**
     * get list leads of campaign with type and campaignid
     */
    server.route({
        method: 'GET',
        path: '/campaigns/{id}/customers/{type}',
        config: {
            handler: campaignController.leadsOfCamp,
            auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get Customer(leads) in a campaigns by id.',
            validate: {
                params: {
                    id: Joi.number().required().description('Campaignid'),
                    type: Joi.number().required().valid([1, 2, 3, 4])
                        .description('4 processtep in lead')
                },
                headers: user_validator_1.jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogCamp.create({
                        type: '/campaigns/{id}/customers/{type}',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    reply(res);
                }
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
    /**
     * get a campaign by campaignid
     */
    server.route({
        method: 'GET',
        path: '/campaigns/{id}',
        config: {
            handler: campaignController.getByCampaignId,
            auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get campaign by campaignid.',
            validate: {
                headers: user_validator_1.jwtValidator,
                params: {
                    id: Joi.number().required().description('campaignid')
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
                    };
                    index_1.LogCamp.create({
                        type: '/campaigns/{id}/customers/{type}',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'params do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    reply(res);
                }
                // headers: jwtValidator
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
    /**
     * get list campaign of 1 user
     */
    server.route({
        method: 'GET',
        path: '/campaigns/userid/{userid}',
        config: {
            handler: campaignController.getByUserId,
            auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get all campaigns of 1 userid',
            validate: {
                headers: user_validator_1.jwtValidator,
                params: {
                    userid: Joi.string().required()
                },
                // headers: jwtValidator
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
                    };
                    index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    index_1.LogCamp.create({
                        type: '/campaigns/userid/{userid}',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'params do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    reply(res);
                }
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
    /**
     * creat new campaign
     */
    server.route({
        method: 'POST',
        path: '/campaigns',
        config: {
            handler: campaignController.createCampaign,
            auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Create a campaign.',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                headers: user_validator_1.jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    index_1.LogCamp.create({
                        type: 'createcamp',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
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