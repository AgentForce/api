"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const Boom = require("boom");
const campaign_controller_1 = require("./campaign-controller");
const CampaignValidator = require("./campaign-validator");
const user_validator_1 = require("../users/user-validator");
/**
 * constant error
 */
const code_errors_1 = require("../../common/code-errors");
/**
 * plugin log campaign
 */
const index_1 = require("../../mongo/index");
const index_2 = require("../../common/index");
function default_1(server, configs, database) {
    const campaignController = new campaign_controller_1.default(configs, database);
    server.bind(campaignController);
    /**
     * get a campaign by period
     */
    server.route({
        method: 'GET',
        path: '/campaigns/period/{period}',
        config: {
            handler: campaignController.getByCampaignId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#drivev3/dangnhap,KH-lienhe:1 #screen11,12,12copy2,12copy3. Trả về danh sách plan 4 tuần của một tháng',
            validate: {
                headers: user_validator_1.headerModel,
                params: {
                    period: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogCamp.create({
                        type: '/campaigns/current',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'params do not valid',
                        meta: {
                            exception: error,
                            response: res
                        }
                    });
                    reply(Boom);
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgCode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgCode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
     * get a campaign by period
     */
    server.route({
        method: 'GET',
        path: '/campaigns/check',
        config: {
            handler: campaignController.checkCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#screenv3/dangnhap:3 Check campaign exist in current day ',
            validate: {
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogCamp.create({
                        type: '/campaigns/current',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'params do not valid',
                        meta: {
                            exception: error,
                            response: res
                        }
                    });
                    reply(Boom);
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object({
                                    status: Joi.boolean().example(true)
                                }),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
     * get a campaign by period
     */
    server.route({
        method: 'GET',
        path: '/campaigns/forwardtarget',
        config: {
            handler: campaignController.checkCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'for screen dashboard: ',
            validate: {
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    reply(Boom);
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object({
                                    status: Joi.boolean().example(true)
                                }),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
        * forcast
        */
    server.route({
        method: 'GET',
        path: '/campaigns/forcast',
        config: {
            handler: campaignController.forcast,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'API for SM. forcast target',
            validate: {
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
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
                        200: {
                            description: 'success',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
     * creat new campaign fa
     */
    server.route({
        method: 'POST',
        path: '/campaigns/fa',
        config: {
            handler: campaignController.createCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#googledrive/dangky #screen10. Create a campaign FA',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
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
                        200: {
                            description: 'success',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
   * creat new campaign fa
   */
    server.route({
        method: 'POST',
        path: '/campaigns/sm',
        config: {
            handler: campaignController.createCampaignSM,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#googledrive/dangky #screen10. Create a campaign SM',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
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
                        200: {
                            description: 'success',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
    * creat new campaign fa
    */
    server.route({
        method: 'POST',
        path: '/campaigns/um',
        config: {
            handler: campaignController.createCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#googledrive/dangky #screen10. Create a campaign UM',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
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
                        200: {
                            description: 'success',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map