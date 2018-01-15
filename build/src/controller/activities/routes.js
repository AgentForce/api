"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const activity_controller_1 = require("./activity-controller");
const ActivitiesValidator = require("./activity-validator");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../common/code-errors");
const index_2 = require("../../common/index");
function default_1(server, configs, database) {
    const activitiesController = new activity_controller_1.default(configs, database);
    server.bind(activitiesController);
    /**
     * history activity of a lead
     */
    server.route({
        method: 'GET',
        path: '/activities/lead/{leadid}/{processstep}',
        config: {
            handler: activitiesController.historyOfLead,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: 'Get activities by leadid, paginate by parameter limit and page',
            validate: {
                params: {
                    leadid: Joi
                        .number()
                        .integer()
                        .required(),
                    processstep: Joi
                        .number()
                        .integer()
                        .valid([-1, 1, 2, 3, 4, 5])
                        .description('-1 to get all'),
                },
                query: Joi.object({
                    limit: Joi
                        .number()
                        .integer()
                        .default(20)
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
    * history activity of a lead
    */
    server.route({
        method: 'GET',
        path: '/activities/{id}',
        config: {
            handler: activitiesController.findById,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: 'Get a activity by id',
            validate: {
                params: {
                    id: Joi
                        .number()
                        .integer()
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
                                    data: Joi.object(),
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
     * create new activity
     */
    server.route({
        method: 'POST',
        path: '/activities',
        config: {
            handler: activitiesController.create,
            auth: "jwt",
            tags: ['api', 'activities'],
            description: 'Create a activity.',
            validate: {
                payload: ActivitiesValidator.createModel,
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    index_1.LogActivity.create({
                        type: 'createactivty',
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
                                    .example(HTTP_STATUS.OK),
                                data: Joi.object(),
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
     * update a activity
     */
    server.route({
        method: 'PUT',
        path: '/activities/{id}',
        config: {
            handler: activitiesController.update,
            auth: "jwt",
            tags: ['activities', 'api'],
            description: 'Update a activity',
            validate: {
                payload: ActivitiesValidator.updateModel,
                params: {
                    id: Joi.number().required()
                        .description('acitivityId')
                        .example(12)
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    index_1.LogActivity.create({
                        type: 'update activity',
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
                                    .example(HTTP_STATUS.OK),
                                data: Joi.object(),
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