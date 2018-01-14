"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const lead_controller_1 = require("./lead-controller");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../common/code-errors");
const LeadValidator = require("./lead-validator");
const index_2 = require("../../common/index");
function default_1(server, configs, database) {
    const leadController = new lead_controller_1.default(configs, database);
    server.bind(leadController);
    server.route({
        method: 'GET',
        path: '/leads/{id}',
        config: {
            handler: leadController.findById,
            auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Find a lead by leadId',
            validate: {
                params: {
                    id: Joi.number()
                        .required()
                        .example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogLead.create({
                        type: 'detaillead',
                        dataInput: request.payload,
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
                        200: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                            })
                        },
                        404: {
                            description: 'not found',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(HTTP_STATUS.NOT_FOUND),
                                code: Joi.string().example(index_2.ManulifeErrors.EX_LEADID_NOT_FOUND),
                                msg: Joi.string()
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
   * lấy 1 campaign theo campaignid
   */
    server.route({
        method: 'GET',
        path: '/leads/camp/{campid}/{processstep}',
        config: {
            handler: leadController.list,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Get leads and activities of lead by campaignid',
            validate: {
                params: {
                    campid: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required(),
                    processstep: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required()
                },
                query: Joi.object({
                    limit: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required(),
                    page: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required()
                })
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object({
                                    data: Joi.array().example([]),
                                    limit: Joi.number(),
                                    page: Joi.number()
                                })
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(HTTP_STATUS.BAD_REQUEST),
                                error: Joi.string(),
                            })
                        }
                    }
                }
            }
        }
    });
    /**
     * lấy 1 campaign theo campaignid
     */
    server.route({
        method: 'GET',
        path: '/leads/reject/{campid}/{processstep}',
        config: {
            handler: leadController.getLeadsReject,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Get leads reject by campaignId and process step of lead',
            validate: {
                params: {
                    campid: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required(),
                    processstep: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required()
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object({
                                    data: Joi.array().example([]),
                                })
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(HTTP_STATUS.BAD_REQUEST),
                                error: Joi.string(),
                            })
                        }
                    }
                }
            }
        }
    });
    /**
    * group count leads in a campaign
    */
    server.route({
        method: 'GET',
        path: '/leads/group/processstep/{campid}',
        config: {
            handler: leadController.groupProcessStepInCamp,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'group count leads in a campaign',
            validate: {
                params: {
                    campid: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required(),
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object({
                                    data: Joi.array().example([]),
                                })
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(HTTP_STATUS.BAD_REQUEST),
                                error: Joi.string(),
                            })
                        }
                    }
                }
            }
        }
    });
    /**
     * Update a lead
     */
    server.route({
        method: 'PUT',
        path: '/leads/{id}',
        config: {
            handler: leadController.update,
            auth: "jwt",
            tags: ['api', 'leads'],
            description: 'update a leads',
            validate: {
                payload: LeadValidator.updateModel,
                params: {
                    id: Joi
                        .number().
                        required()
                        .example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogLead.create({
                        type: 'updatelead',
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
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(HTTP_STATUS.BAD_REQUEST),
                                error: Joi.string(),
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
     * create new a lead
     */
    server.route({
        method: 'POST',
        path: '/leads',
        config: {
            handler: leadController.create,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Create new lead',
            validate: {
                payload: LeadValidator.createLeadModel,
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogLead.create({
                        type: 'createlead',
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
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(HTTP_STATUS.BAD_REQUEST),
                                error: Joi.string(),
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